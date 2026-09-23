import Link from "next/link";
import { headers } from "next/headers";
import ShootQr from "@/components/ShootQr";
import { listedShoots } from "@/lib/shoots";
import { thumbSrc } from "@/lib/utils";
import BookShootForm from "./book-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "1-1 Shoots" };

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "www.mesaverdefootball.com";
  const proto = h.get("x-forwarded-proto") || "https";
  return `${proto}://${host}`;
}

export default function ShootsPage() {
  const base = origin();
  const folders = listedShoots();

  return (
    <main className="section">
      <div className="section-head">
        <div>
          <div className="kicker">Private sessions</div>
          <h1 className="display lg">
            1-1 <span className="orange">SHOOTS</span>
          </h1>
          <hr className="rule" />
          <p className="cart-note">
            Each shoot gets its own folder. The QR code opens that folder and nothing else.
            Game photos stay on the main gallery.
          </p>
        </div>
      </div>

      <BookShootForm />

      <div className="section-head" style={{ marginTop: 48 }}>
        <div>
          <div className="kicker">Folders</div>
          <h2 className="display md">SAMPLE SETS</h2>
          <p className="cart-note">
            These two are placeholders so the page has a shape. Real shoots replace them, each with
            its own code.
          </p>
        </div>
      </div>

      <div className="shoot-grid">
        {folders.map((folder) => {
          const href = `/shoots/${folder.code}`;
          return (
            <article className="shoot-card" key={folder.code}>
              <Link href={href} className="shoot-cover">
                <img src={thumbSrc(folder.cover)} alt="" />
                {folder.sample && <span>Sample</span>}
              </Link>
              <div className="shoot-card-body">
                <div>
                  <h3>{folder.title}</h3>
                  <p>
                    {folder.subject} · {folder.when} · {folder.photos.length} frames
                  </p>
                  <Link href={href}>Open folder</Link>
                </div>
                <ShootQr url={`${base}${href}`} label={folder.code} />
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
