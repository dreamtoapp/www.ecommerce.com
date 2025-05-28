'use client';

import {
  useActionState,
  useEffect,
  useState,
} from 'react';

import { toast } from 'sonner';

import ImageUpload from '@/components/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@prisma/client';

import { updateCategory } from '../action/update-category';

export default function EditCategoryForm({ initialData }: { initialData: Category }) {
  const [mainPreviewUrl, setMainPreviewUrl] = useState<string | null>(null);

  // Minimal initial state for useActionState
  const initialState = { success: false, message: '' };

  // Server action handler for useActionState
  const [state, handleSubmit, isPending] = useActionState(
    updateCategory,
    initialState
  );

  const handleMainFileSelect = (files: File[] | null) => {
    const file = files && files.length > 0 ? files[0] : null;
    setMainPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  useEffect(() => {
    if (state?.success) {
      toast.success(state.message || 'تمت العملية بنجاح');
      setMainPreviewUrl(null);
    } else if (state?.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <input name="id" type="hidden" defaultValue={initialData.id} />

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="categoryName">اسم الصنف</Label>
            <Input
              id="categoryName"
              name="categoryName"
              defaultValue={initialData.name}
              placeholder="مثال: إلكترونيات"
              required
              minLength={2}
            />
            <p className="text-[0.8rem] text-muted-foreground">
              الاسم الرئيسي للصنف.
            </p>
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="categoryDescription">الوصف (اختياري)</Label>
            <Textarea
              id="categoryDescription"
              name="categoryDescription"
              placeholder="وصف موجز للصنف..."
              className="resize-none"
              defaultValue={initialData.description || ''}
            />
          </div>
        </div>

        <div className="w-[200px] h-[200px] mx-auto">
          <ImageUpload
            name="imageUrl"
            initialImage={
              mainPreviewUrl !== null
                ? mainPreviewUrl
                : initialData.imageUrl || undefined
            }
            onImageUpload={handleMainFileSelect}
            aspectRatio={1}
            maxSizeMB={2}
            multiple={false}
            allowedTypes={[
              'image/png',
              'image/jpeg',
              'image/webp',
            ]}
            uploadLabel="صورة الفئة"
            previewType="contain"
            alt="صورة الفئة"
            minDimensions={{ width: 200, height: 200 }}
            required={true}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto"
        >
          {isPending ? 'جاري تعديل الصنف...' : 'تعديل صنف'}
        </Button>
      </div>
    </form>
  );
}
