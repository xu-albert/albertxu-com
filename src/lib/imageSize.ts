import fs from "fs";
import path from "path";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const PNG_HEADER_BYTES = 24;

export interface ImageSize {
  width: number;
  height: number;
}

/**
 * Intrinsic pixel size of a file under public/, read from its header at build
 * time so a page can put real `width`/`height` on an <img> and reserve the box
 * before the bytes arrive. Reading the file rather than hand-listing numbers
 * means a replaced screenshot can't leave a stale aspect ratio behind.
 *
 * PNG only. Anything else — a missing file, a JPEG, a truncated header —
 * returns undefined, which drops both attributes and leaves the markup exactly
 * as it would be without this.
 */
export function publicImageSize(src: string): ImageSize | undefined {
  const file = path.join(process.cwd(), "public", src);
  const head = Buffer.alloc(PNG_HEADER_BYTES);

  try {
    const fd = fs.openSync(file, "r");
    try {
      if (fs.readSync(fd, head, 0, PNG_HEADER_BYTES, 0) < PNG_HEADER_BYTES) {
        return undefined;
      }
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    return undefined;
  }

  // Signature, then the IHDR chunk: 4-byte length, the tag, width, height.
  if (!head.subarray(0, 8).equals(PNG_SIGNATURE)) return undefined;
  if (head.subarray(12, 16).toString("latin1") !== "IHDR") return undefined;

  const width = head.readUInt32BE(16);
  const height = head.readUInt32BE(20);
  return width > 0 && height > 0 ? { width, height } : undefined;
}
