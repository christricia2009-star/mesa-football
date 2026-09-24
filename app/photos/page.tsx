import GalleryClient from "./ui";

export const metadata = { title: "Photos" };

export default function GalleryPage({
  searchParams,
}: {
  searchParams: { jersey?: string; q?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const jersey = searchParams.jersey?.replace(/[^\d]/g, "");
  return <GalleryClient initialQuery={q || (jersey ? `#${jersey}` : "")} />;
}
