import { fromBuffer } from 'pdf2pic';
import sharp from 'sharp';

export interface Base64Image {
  data: string; // base64-encoded PNG
  page: number;
}

export async function convertPdfToImages(buffer: Buffer): Promise<Base64Image[]> {
  const converter = fromBuffer(buffer, {
    density: 200,
    format: 'png',
    width: 1700,
    height: 2200,
    preserveAspectRatio: true,
  });

  // Get page count by attempting conversions; pdf2pic returns null for out-of-range pages
  const results: Base64Image[] = [];
  let page = 1;

  while (true) {
    const result = await converter(page, { responseType: 'buffer' });
    if (!result || !result.buffer) break;

    // Resize to reduce token usage while preserving readability
    const resized = await sharp(result.buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .png({ compressionLevel: 6 })
      .toBuffer();

    results.push({ data: resized.toString('base64'), page });
    page++;
  }

  if (results.length === 0) {
    throw new Error('PDFからページを抽出できませんでした');
  }

  return results;
}
