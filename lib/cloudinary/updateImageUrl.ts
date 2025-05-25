"use server";
import db from '@/lib/prisma';

interface UpdateImageUrlParams {
  table: string;
  recordId: string;
  url: string;
}

export async function updateImageUrl({ table, recordId, url }: UpdateImageUrlParams) {
  if (table !== 'user') throw new Error('Only user table is supported in this example');
  try {
    await db.user.update({
      where: { id: recordId },
      data: { image: url }, // assumes your user table has an 'image' field
    });
    return { ok: true, msg: 'تم تحديث الصورة بنجاح' };
  } catch (error) {
    return { ok: false, msg: 'فشل في تحديث الصورة', error };
  }
}
