export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function downloadUrl(src: string, filename: string) {
  return `/api/download?src=${encodeURIComponent(src)}&filename=${encodeURIComponent(filename)}`;
}

export function thumbSrc(src: string) {
  if (!src.startsWith("/gallery/")) return src;
  return `/gallery/thumbs/${src.slice("/gallery/".length)}`;
}

export function formatBytes(n?: number) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function uid() {
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
