import QRCode from "qrcode";

export default async function ShootQr({ url, label }: { url: string; label: string }) {
  const svg = await QRCode.toString(url, {
    type: "svg",
    margin: 1,
    width: 168,
    color: { dark: "#1f1814", light: "#fbf6ee" },
  });
  return (
    <figure className="shoot-qr">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption>{label}</figcaption>
    </figure>
  );
}
