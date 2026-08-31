'use client';

import { useRef, useState } from 'react';
import { useResumeStore } from '@/store/resumeStore';
import { useI18n } from '@/i18n/I18nContext';

const MAX_DIMENSION = 400;
const JPEG_QUALITY = 0.85;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

async function fileToResizedDataUrl(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error('image-decode-failed'));
    i.src = dataUrl;
  });

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas-unsupported');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

export default function PhotoUpload() {
  const photo = useResumeStore((s) => s.data.personal.photo);
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError(t.photo.errorType);
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError(t.photo.errorSize);
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      updatePersonal({ photo: dataUrl });
    } catch {
      setError(t.photo.errorDecode);
    } finally {
      setBusy(false);
    }
  }

  function onRemove() {
    updatePersonal({ photo: undefined });
    if (inputRef.current) inputRef.current.value = '';
    setError(null);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-16 h-20 rounded-md border border-dashed border-zinc-900/10 bg-white/70 overflow-hidden flex items-center justify-center text-zinc-500 hover:border-lime-500/60 hover:text-lime-700 transition-colors shrink-0"
        aria-label={photo ? t.photo.change : t.photo.upload}
      >
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl">＋</span>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="px-3 py-1.5 rounded-md text-xs font-medium bg-zinc-900/5 hover:bg-zinc-900/10 text-zinc-900 transition-colors disabled:opacity-50"
          >
            {busy ? t.photo.processing : photo ? t.photo.change : t.photo.upload}
          </button>
          {photo && (
            <button
              type="button"
              onClick={onRemove}
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-white/70 border border-zinc-900/10 hover:border-red-500/50 hover:text-red-500 text-zinc-600 transition-colors"
            >
              {t.photo.remove}
            </button>
          )}
        </div>
        <p className="mt-1.5 text-[11px] text-zinc-500 leading-snug">
          {error ?? t.photo.hint}
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
        }}
      />
    </div>
  );
}
