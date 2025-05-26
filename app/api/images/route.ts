import {
  NextRequest,
  NextResponse,
} from 'next/server';

import prisma from '@/lib/prisma';
import { uploadImageToCloudinary } from '@/lib/sendTOCloudinary';

const SUPPORTED_TABLES = {
  user: 'user',
  product: 'product',
  supplier: 'supplier',
  // Add more table keys here
} as const;

type TableName = keyof typeof SUPPORTED_TABLES;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const recordId = formData.get('recordId') as string | null;
    const table = formData.get('table') as TableName | null;
    const cloudinaryPreset = formData.get('cloudinaryPreset') as string | null;
    const folder = formData.get('folder') as string | null;

    // ✅ Log inputs for debugging
    console.log('Incoming Upload Request:');
    console.log('file:', file ? file.name : 'null');
    console.log('recordId:', recordId);
    console.log('table:', table);
    console.log('cloudinaryPreset:', cloudinaryPreset);
    console.log('folder:', folder);

    if (!file || !recordId || !table || !cloudinaryPreset) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: {
          file: file ? file.name : null,
          recordId,
          table,
          cloudinaryPreset,
        },
      }, { status: 400 });
    }

    // Validate table and get model dynamically
    const modelKey = SUPPORTED_TABLES[table];
    const model = (prisma as any)[modelKey];

    if (!model?.update) {
      console.error(`Invalid model: ${table}`);
      return NextResponse.json({ error: `Invalid table model: ${table}` }, { status: 400 });
    }

    // Convert file to base64 Data URI
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(dataUri, cloudinaryPreset, folder || '');
    console.log('Image uploaded to Cloudinary:', imageUrl);

    // Update record in DB
    const result = await model.update({
      where: { id: recordId },
      data: { image: imageUrl },
    });

    console.log(`Updated ${table} with ID ${recordId}:`, result);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
