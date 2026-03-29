import Anthropic from '@anthropic-ai/sdk';

// NOTE: API key is exposed client-side via VITE_ prefix.
// For a production deployment, proxy requests through a server-side edge function
// rather than exposing the key in the browser bundle.
const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY as string,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `You are an expert wildlife and sports photography color grading specialist and image editing consultant.

I will provide you with TWO photographs:
- IMAGE 1 (Reference): A photo edited exactly the way the photographer wants — this is the target style.
- IMAGE 2 (Target): The photo that needs to be transformed to match the reference's style.

Analyze the REFERENCE photo's editing style in extreme technical detail, then write a single comprehensive image transformation prompt.

Your output must be ONLY the prompt string — no preamble, no headers, no markdown, no explanation. Output the raw prompt text only.

The prompt must cover ALL of these aspects with specific, measurable language:

COLOR GRADING: Color temperature (e.g., "warm amber ~5800K"), shadow color toning (e.g., "cool teal-blue shadows"), highlight toning, midtone hue shift, film emulation characteristics if present.

TONAL ADJUSTMENTS: Shadow density (crushed blacks, lifted shadows, etc.), highlight recovery (preserved, rolled-off), overall exposure bias, gamma/midtone brightness, tone curve shape (S-curve, lifted shadows, filmic roll-off).

CONTRAST & TEXTURE: Overall contrast level (flat/moderate/high), local contrast and clarity, texture enhancement or softening, sharpness of subject details, micro-contrast.

SATURATION & COLOR: Overall saturation level, per-channel saturation (e.g., "boosted oranges and yellows, desaturated blues"), vibrance treatment, color emphasis.

ATMOSPHERE & MOOD: Time of day feel (golden hour, blue hour, harsh midday, overcast), cinematic quality, emotional register, environmental atmosphere (hazy, crisp, misty).

WILDLIFE/SPORTS SPECIFICS: Fur, feather, or skin texture handling, eye detail and specular highlights, motion and depth-of-field rendering, background treatment and bokeh quality.

End the prompt with exactly this sentence: "Apply this exact photographic editing style to the provided photo. Preserve all subjects, composition, and content exactly as they appear. The output must be strictly photorealistic — not artistic, painted, illustrated, stylized, or cartoon-like in any way. Maintain sharp, fine detail in all subjects and textures."`;

type SupportedMediaType = 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';

function toSupportedMediaType(mime: string): SupportedMediaType {
  const map: Record<string, SupportedMediaType> = {
    'image/jpeg': 'image/jpeg',
    'image/jpg': 'image/jpeg',
    'image/png': 'image/png',
    'image/gif': 'image/gif',
    'image/webp': 'image/webp',
  };
  return map[mime.toLowerCase()] ?? 'image/jpeg';
}

export async function analyzeStyle(
  referenceImageBase64: string,
  referenceMediaType: string,
  userImageBase64: string,
  userMediaType: string,
): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Here are the two photos. IMAGE 1 is the reference (the style I want), IMAGE 2 is the target (the photo to transform). Write the style transformation prompt.',
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: toSupportedMediaType(referenceMediaType),
              data: referenceImageBase64,
            },
          },
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: toSupportedMediaType(userMediaType),
              data: userImageBase64,
            },
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude did not return a style prompt. Please try again.');
  }

  return textBlock.text.trim();
}
