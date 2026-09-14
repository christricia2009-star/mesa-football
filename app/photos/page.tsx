import GalleryClient from "./ui";

export const metadata = { title: "Photos" };

export default function GalleryPage({
  searchParams,
}: {
  searchParams: { jersey?: string };
}) {
  const jersey = searchParams.jersey?.replace(/[^\d]/g, "");
  return <GalleryClient initialQuery={jersey ? `#${jersey}` : ""} />;
}
