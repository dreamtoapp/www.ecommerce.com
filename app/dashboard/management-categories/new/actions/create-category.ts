'use server';

import { revalidatePath } from 'next/cache';

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { prevState } from '@/types/commonType';

export async function createCategory(
  _prevState: prevState,
  formData: FormData
): Promise<prevState> {
  const name = formData.get('categoryName') as string | null;
  const description = formData.get('categoryDescription') as string | null;
  const imageUrl = formData.get('imageUrl') as File | null; // Main image
  const slug = slugify(name || '');

  if (!name || !slug) {
    throw new Error('الاسم والاسم المستعار (slug) مطلوبان.');
  }

  let mainImageUrl: string | null = null;
  if (imageUrl && imageUrl.size > 0) {
    const mainImageData = await ImageToCloudinary(
      imageUrl,
      process.env.CLOUDINARY_UPLOAD_PRESET_CATEGORY || '',
    );
    console.log({ mainImageData });

    if (mainImageData.result?.secure_url) {
      mainImageUrl = mainImageData.result.secure_url;
    }
  }
  console.log({ mainImageUrl, imageUrl })

  try {
    const newCategory = await db.category.create({
      data: { name, description, slug, imageUrl: mainImageUrl },
    });

    revalidatePath('/dashboard/categories');
    revalidatePath(`/categories/${newCategory.slug}`);

    return { success: true, message: 'تم إنشاء الفئة بنجاح' };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2002'
    ) {
      const fields = (error as any).meta?.target as string[] | undefined;
      if (fields?.includes('slug')) {
        throw new Error('توجد فئة بهذا الاسم المستعار بالفعل.');
      }
      if (fields?.includes('name')) {
        throw new Error('توجد فئة بهذا الاسم بالفعل.');
      }
    }

    console.error('[❌ createCategory]', error);
    throw new Error('حدث خطأ غير متوقع أثناء إنشاء الفئة.');
  }
}
