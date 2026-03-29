import { useAppStore } from '../store/useAppStore';
import { analyzeStyle } from './claude';
import { transformImage } from './gemini';
import { saveToHistory, generateId } from './history';
import { slidersToStylePrompt, CustomPreset } from './customPresets';
import { Preset } from './presets';

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = () => reject(new Error(`Failed to read: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function getPromptFromPreset(preset: Preset | CustomPreset): string {
  if ('sliders' in preset) {
    // CustomPreset — derive prompt from sliders
    return slidersToStylePrompt(preset.name, preset.sliders);
  }
  return (preset as Preset).stylePrompt;
}

// ── Single-image pipeline (original Claude → Gemini flow) ────────────────────
export async function runPipeline(): Promise<void> {
  const { refImage, userImage, setStatus, setStylePrompt, setGeneratedImage, setError } =
    useAppStore.getState();

  if (!refImage || !userImage) {
    setError('Please upload both photos before transforming.');
    return;
  }

  try {
    setStatus('analyzing');
    const [refB64, userB64] = await Promise.all([
      fileToBase64(refImage),
      fileToBase64(userImage),
    ]);

    const timer = setTimeout(() => {
      if (useAppStore.getState().status === 'analyzing') setStatus('writing');
    }, 2000);

    const stylePrompt = await analyzeStyle(
      refB64, refImage.type || 'image/jpeg',
      userB64, userImage.type || 'image/jpeg',
    );
    clearTimeout(timer);
    setStylePrompt(stylePrompt);

    setStatus('transforming');
    const { data, mimeType } = await transformImage(stylePrompt, userB64, userImage.type || 'image/jpeg');
    setGeneratedImage(data, mimeType);

    setStatus('finishing');
    await sleep(900);
    setStatus('done');
  } catch (err) {
    useAppStore.getState().setError(
      err instanceof Error ? err.message : 'Unexpected error. Please try again.',
    );
  }
}

// ── Batch pipeline (preset → Gemini, no Claude round-trip per image) ──────────
export async function runBatchPipeline(): Promise<void> {
  const { batchItems, selectedPreset, updateBatchItem, setBatchRunning } =
    useAppStore.getState();

  if (!selectedPreset || batchItems.length === 0) return;

  const stylePrompt = getPromptFromPreset(selectedPreset);
  const pending = batchItems.filter((i) => i.status === 'pending');
  if (pending.length === 0) return;

  setBatchRunning(true);

  for (const item of pending) {
    updateBatchItem(item.id, { status: 'processing' });
    try {
      const b64 = await fileToBase64(item.file);
      const mime = item.file.type || 'image/jpeg';
      const { data, mimeType } = await transformImage(stylePrompt, b64, mime);

      updateBatchItem(item.id, { status: 'done', resultBase64: data, resultMimeType: mimeType });

      saveToHistory({
        id: generateId(),
        date: new Date().toISOString(),
        presetName: selectedPreset.name,
        originalFilename: item.file.name,
        resultBase64: data,
        resultMimeType: mimeType,
      });
    } catch (err) {
      updateBatchItem(item.id, {
        status: 'error',
        error: err instanceof Error ? err.message : 'Failed',
      });
    }
  }

  setBatchRunning(false);
}
