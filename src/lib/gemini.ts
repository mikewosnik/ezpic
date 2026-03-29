import { GoogleGenerativeAI } from '@google/generative-ai';

// NOTE: API key is exposed client-side via VITE_ prefix.
// For a production deployment, proxy through a server-side edge function.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY as string);

export interface GeneratedImage {
  data: string;      // base64
  mimeType: string;  // e.g. "image/png"
}

export async function transformImage(
  stylePrompt: string,
  userImageBase64: string,
  userMediaType: string,
): Promise<GeneratedImage> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-preview-image-generation',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requestConfig: any = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: stylePrompt },
          {
            inlineData: {
              mimeType: userMediaType,
              data: userImageBase64,
            },
          },
        ],
      },
    ],
    // responseModalities tells Gemini to return image data in the response parts.
    // The @google/generative-ai types may not yet include this field for preview models,
    // so we pass it via a loosely-typed request object.
    generationConfig: {
      responseModalities: ['IMAGE', 'TEXT'],
    },
  };

  const result = await model.generateContent(requestConfig);

  const candidates = result.response.candidates;
  if (!candidates || candidates.length === 0) {
    const blockReason = result.response.promptFeedback?.blockReason;
    if (blockReason) {
      throw new Error(
        `The image was blocked by Gemini's safety filters (${blockReason}). Try a different photo.`,
      );
    }
    throw new Error('Gemini returned no output. Please try again.');
  }

  const parts = candidates[0].content.parts;
  for (const part of parts) {
    if (part.inlineData?.data) {
      return {
        data: part.inlineData.data,
        mimeType: part.inlineData.mimeType ?? 'image/png',
      };
    }
  }

  // If we got text but no image, surface it for debugging
  const textPart = parts.find((p) => p.text);
  if (textPart?.text) {
    throw new Error(`Gemini returned text instead of an image: "${textPart.text}"`);
  }

  throw new Error(
    'Gemini did not return a transformed image. The photo may have been filtered. Try a different shot.',
  );
}
