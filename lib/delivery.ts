import { getDownloadUrl, issueSignedToken, presignUrl } from "@vercel/blob";
import { blobPathname } from "./originals";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export function blobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export async function signedOriginalUrl(src: string) {
  const pathname = blobPathname(src);
  const validUntil = Date.now() + FIFTEEN_MINUTES;
  const issued = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(issued, {
    access: "private",
    operation: "get",
    pathname,
    validUntil,
  });
  return getDownloadUrl(presignedUrl);
}
