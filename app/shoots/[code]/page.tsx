import Link from "next/link";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import ShootQr from "@/components/ShootQr";
import { shootByCode } from "@/lib/shoots";
import ShootGallery from "./gallery";

export const dynamic = "force-dynamic";

export function generateMetadata({ params }: { params: { code: string } }) {
  const folder = shootByCode(params.code);
  return { title: folder ? folder.title : "Shoot" };
}

export default function ShootFolderPage({ params }: { params: { code: string } }) {
  const folder = shootByCode(params.code);
  if (!folder) notFound();
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "www.mesaverdefootball.com";
  const proto = h.get("x-forwarded-proto") || "https";
  const url = `${proto}://${host}/shoots/${folder.code}`;

  return (
    <main className="section">
      <p className="kicker">
        <Link href="/shoots">1-1 shoots</Link>
      </p>
      <div className="shoot-folder-head">
        <div>
          <h1 className="display lg">
            {folder.sample ? "SAMPLE · " : ""}
            {folder.title}
          </h1>
          <hr className="rule" />
          <p className="cart-note">
            {folder.subject} · {folder.when} · {folder.photos.length} frames. This link is the
            folder. The QR opens the same page.
          </p>
        </div>
        <ShootQr url={url} label={folder.code} />
      </div>
      <ShootGallery photos={folder.photos} />
    </main>
  );
}
