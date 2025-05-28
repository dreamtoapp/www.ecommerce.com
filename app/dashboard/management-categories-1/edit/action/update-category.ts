'use server'

import { ImageToCloudinary } from '@/lib/cloudinary/uploadImageToCloudinary';
import db from '@/lib/prisma';
import { slugify } from '@/lib/utils';
import { prevState } from '@/types/commonType';
import { revalidatePath } from 'next/cache';

export async function updateCategory(
  _prevState: prevState,
  formData: FormData
): Promise<prevState> {
  const id = formData.get('id') as string | null;
  const name = formData.get('categoryName') as string | null;
  const description = formData.get('categoryDescription') as string | null;
  const imageFile = formData.get('imageUrl') as File | null;
  const slug = slugify(name || '');

  if (!id || !name || !slug) {
    return { success: false, message: 'الاسم، الاسم المستعار (slug)، ومعرّف الفئة مطلوبة.' };
  }

  let mainImageUrl: string | null = null;
  if (imageFile && imageFile instanceof File && imageFile.size > 0) {
    const mainImageData = await ImageToCloudinary(
      imageFile,
      process.env.CLOUDINARY_UPLOAD_PRESET_CATEGORY || '',
    );
    if (mainImageData.result?.secure_url) {
      mainImageUrl = mainImageData.result.secure_url;
    }
  }

  try {
    const updatedCategory = await db.category.update({
      where: { id },
      data: {
        name,
        description,
        slug,
        imageUrl: mainImageUrl !== null ? mainImageUrl : undefined,
      },
    });

    revalidatePath('/dashboard/categories');
    revalidatePath(`/categories/${updatedCategory.slug}`);

    return { success: true, message: 'تم تحديث الفئة بنجاح' };
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as any).code === 'P2002'
    ) {
      const fields = (error as any).meta?.target as string[] | undefined;
      if (fields?.includes('slug')) {
        return { success: false, message: 'توجد فئة بهذا الاسم المستعار بالفعل.' };
      }
      if (fields?.includes('name')) {
        return { success: false, message: 'توجد فئة بهذا الاسم بالفعل.' };
      }
    }
    console.error('[❌ updateCategory]', error);
    return { success: false, message: 'حدث خطأ غير متوقع أثناء تحديث الفئة.' };
  }
}