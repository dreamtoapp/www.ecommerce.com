// lib/cloudinary/uploadImageToCloudinary.ts
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Upload image to Cloudinary and return an optimized secure URL.
 * @param filePath - Local path or remote URL
 * @param preset - Cloudinary upload preset
 * @returns Optimized secure URL string
 */
export async function uploadImageToCloudinary(filePath: string, preset: string, folder: string): Promise<string> {
  const result = await cloudinary.v2.uploader.upload(filePath, {
    upload_preset: preset,
    folder: folder,
  });

  // Generate an optimized URL with auto format, quality, and responsive width
  return cloudinary.v2.url(result.public_id, {
    secure: true,
    transformation: [
      { quality: 'auto' },
      { fetch_format: 'auto' },
      { width: 'auto', crop: 'scale' },
    ],
  });
}
