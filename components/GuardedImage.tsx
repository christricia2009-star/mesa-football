"use client";

export default function GuardedImage({
  src,
  alt = "",
  loading,
}: {
  src: string;
  alt?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <span
      className="guarded"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <img src={src} alt={alt} draggable={false} loading={loading} />
      <span className="guarded-shield" aria-hidden="true" />
    </span>
  );
}
