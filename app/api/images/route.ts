import {
  NextRequest,
  NextResponse,
} from 'next/server';

import prisma from '@/lib/prisma';
import { uploadImageToCloudinary } from '@/lib/sendTOCloudinary';

// Allowed models for image updates
const SUPPORTED_TABLES = {
  user: 'user',
  product: 'product',
  supplier: 'supplier',
  category: 'category',
  order: 'order',
  company: 'company',
} as const;

type TableName = keyof typeof SUPPORTED_TABLES;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const recordId = formData.get('recordId') as string | null;
    const table = formData.get('table') as TableName | null;
    const tableField = formData.get('tableField') as string | null;
    const cloudinaryPreset = formData.get('cloudinaryPreset') as string | null;
    const folder = formData.get('folder') as string | null;

    // Log incoming form values
    console.log('[UPLOAD REQUEST]', {
      file: file?.name ?? null,
      recordId,
      table,
      tableField,
      cloudinaryPreset,
      folder,
    });

    // Validate required fields
    if (!file || !recordId || !table || !cloudinaryPreset || !tableField) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          details: {
            file: file?.name ?? null,
            recordId,
            table,
            tableField,
            cloudinaryPreset,
          },
        },
        { status: 400 }
      );
    }

    const modelKey = SUPPORTED_TABLES[table];
    const model = (prisma as any)[modelKey];

    if (!model?.update) {
      return NextResponse.json(
        { error: `Invalid model or model not supported for updates: ${table}` },
        { status: 400 }
      );
    }

    // Convert file to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload to Cloudinary
    const imageUrl = await uploadImageToCloudinary(dataUri, cloudinaryPreset, folder ?? '');
    console.log('[CLOUDINARY UPLOAD SUCCESS]', imageUrl);

    // Dynamically build data object
    const updateData = {
      [tableField]: imageUrl,
    };

    let result;
    try {
      result = await model.update({
        where: { id: recordId },
        data: updateData,
      });
    } catch (dbError) {
      console.error('[DB UPDATE ERROR]', dbError);
      return NextResponse.json({ error: 'Failed to update record in DB' }, { status: 500 });
    }

    console.log(`[${table.toUpperCase()} UPDATED]`, result);

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('[UNHANDLED ERROR]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
