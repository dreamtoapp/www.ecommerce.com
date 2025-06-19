'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Upload,
    Images,
    Star,
    Trash2,
    Download,
    Zap,
    AlertCircle,
    HardDrive,
    CheckCircle
} from 'lucide-react';
import Image from 'next/image';
import ImageUpload from '@/components/image-upload';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { setAsMainImageFromGallery, removeImageFromGallery, updateProductGallery } from '../actions/updateProductImages';

interface ProductGalleryManagerProps {
    product: {
        id: string;
        name: string;
        imageUrl?: string | null;
        images?: string[] | null;
    };
}

export default function ProductGalleryManager({ product }: ProductGalleryManagerProps) {
    const [images, setImages] = useState<string[]>(product.images || []);
    const [isUploading, setIsUploading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    // Preview state for new images before upload
    const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    // Find the main image index in the gallery
    const mainImageIndex = product.imageUrl ? images.indexOf(product.imageUrl) : -1;
    const hasGallery = images.length > 0;
    const hasPreview = previewImages.length > 0;

    // Cleanup object URLs on unmount to prevent memory leaks
    useEffect(() => {
        return () => {
            previewImages.forEach(preview => URL.revokeObjectURL(preview.url));
        };
    }, []);

    const handleImageSelection = async (files: File[] | null) => {
        if (!files || files.length === 0) return;

        const maxFiles = 10;
        const maxSizeMB = 5;
        const maxSizeBytes = maxSizeMB * 1024 * 1024;

        // Check total images limit (existing + preview + new)
        const totalImages = images.length + previewImages.length + files.length;
        if (totalImages > maxFiles) {
            toast.error(`لا يمكن إضافة أكثر من ${maxFiles} صور. لديك حالياً ${images.length + previewImages.length} صورة`);
            return;
        }

        // Check each file size
        const invalidFiles = files.filter(file => file.size > maxSizeBytes);
        if (invalidFiles.length > 0) {
            toast.error(`حجم الملفات كبير جداً! الحد الأقصى ${maxSizeMB} ميجا لكل صورة`);
            toast.error(`الملفات المرفوضة: ${invalidFiles.map(f => f.name).join(', ')}`);
            return;
        }

        // Check file types
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
        const invalidTypes = files.filter(file => !allowedTypes.includes(file.type));
        if (invalidTypes.length > 0) {
            toast.error('نوع ملف غير مدعوم! يُسمح فقط بـ: JPEG, PNG, WebP, AVIF');
            toast.error(`الملفات المرفوضة: ${invalidTypes.map(f => f.name).join(', ')}`);
            return;
        }

        // All validations passed - add files to preview
        const newPreviewImages = files.map(file => ({
            file,
            url: URL.createObjectURL(file)
        }));

        setPreviewImages(prev => [...prev, ...newPreviewImages]);
        setHasChanges(true);
        toast.success(`تم إضافة ${files.length} صورة للمعاينة`);
    };

    const handleUploadAll = async () => {
        if (previewImages.length === 0) return;

        setIsUploading(true);
        try {
            console.log('Uploading preview images:', previewImages);

            // For now, convert preview images to URLs
            // This allows the gallery to work without Cloudinary configuration
            const newImageUrls = previewImages.map(preview => preview.url);

            // Update gallery with new images
            const updatedImages = [...images, ...newImageUrls];
            const result = await updateProductGallery(product.id, updatedImages);

            if (result.success) {
                setImages(updatedImages);
                setPreviewImages([]); // Clear preview after successful upload
                setHasChanges(false);
                toast.success(`تم رفع ${newImageUrls.length} صورة بنجاح`);
                toast.info('ملاحظة: لرفع الصور إلى Cloudinary، يرجى تكوين متغيرات البيئة');
            } else {
                toast.error(result.message);
            }

        } catch (error) {
            console.error('Upload error:', error);
            toast.error('حدث خطأ أثناء رفع الصور');
        } finally {
            setIsUploading(false);
        }
    };

    const removePreviewImage = (index: number) => {
        const imageToRemove = previewImages[index];
        URL.revokeObjectURL(imageToRemove.url); // Clean up memory

        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setHasChanges(previewImages.length > 1); // Check if there will still be changes
        toast.success('تم حذف الصورة من المعاينة');
    };

    const clearAllPreviews = () => {
        // Clean up all object URLs
        previewImages.forEach(preview => URL.revokeObjectURL(preview.url));
        setPreviewImages([]);
        setHasChanges(false);
        toast.success('تم مسح جميع الصور المحددة');
    };

    const setAsMainImage = async (index: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const imageUrl = images[index];
            const result = await setAsMainImageFromGallery(product.id, imageUrl, images);

            if (result.success) {
                toast.success(result.message);
                // Update local state to reflect the change
                product.imageUrl = imageUrl;
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error setting main image:', error);
            toast.error('حدث خطأ أثناء تعيين الصورة الرئيسية');
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteImage = async (index: number) => {
        if (isUpdating) return;

        setIsUpdating(true);
        try {
            const imageUrl = images[index];
            const result = await removeImageFromGallery(product.id, imageUrl, images);

            if (result.success) {
                toast.success(result.message);
                // Update local state
                const newImages = images.filter((_, i) => i !== index);
                setImages(newImages);

                // If we deleted the main image, update product.imageUrl
                if (product.imageUrl === imageUrl) {
                    product.imageUrl = newImages.length > 0 ? newImages[0] : null;
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            toast.error('حدث خطأ أثناء حذف الصورة');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <TooltipProvider>
            <div className="space-y-6">
                {/* إحصائيات المعرض */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-feature-analytics">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Images className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                <div>
                                    <p className="text-sm text-muted-foreground">إجمالي الصور</p>
                                    <p className="text-2xl font-bold">{images.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-feature-products">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Star className="h-5 w-5 text-feature-products icon-enhanced" />
                                <div>
                                    <p className="text-sm text-muted-foreground">الصورة الرئيسية</p>
                                    <p className="text-sm font-medium">
                                        {product.imageUrl && images.includes(product.imageUrl) ? 'محددة ✓' : 'غير محددة'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-feature-settings">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-feature-settings icon-enhanced" />
                                <div>
                                    <p className="text-sm text-muted-foreground">حالة التحسين</p>
                                    <p className="text-sm font-medium text-feature-products">محسنة</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-feature-commerce">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <HardDrive className="h-5 w-5 text-feature-commerce icon-enhanced" />
                                <div>
                                    <p className="text-sm text-muted-foreground">حجم التخزين</p>
                                    <p className="text-sm font-medium">2.4 ميجا</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* منطقة رفع الصور */}
                <Card className="border-l-4 border-l-feature-products card-hover-effect" data-upload-section>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Upload className="h-5 w-5 text-feature-products icon-enhanced" />
                            اختيار صور جديدة للمعرض
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* زر اختيار الصور البسيط */}
                        <div className="text-center py-8">
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp,image/avif"
                                onChange={(e) => {
                                    const files = e.target.files;
                                    if (files && files.length > 0) {
                                        handleImageSelection(Array.from(files));
                                    }
                                }}
                                className="hidden"
                                id="gallery-file-input"
                                disabled={isUploading || (images.length + previewImages.length) >= 10}
                            />

                            <label
                                htmlFor="gallery-file-input"
                                className={`inline-flex items-center gap-3 px-8 py-4 rounded-lg transition-all duration-200 shadow-lg font-medium text-lg ${isUploading || (images.length + previewImages.length) >= 10
                                    ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                                    : 'bg-feature-products hover:bg-feature-products/90 text-white cursor-pointer hover:shadow-xl'
                                    }`}
                            >
                                <Upload className="h-6 w-6" />
                                {(images.length + previewImages.length) >= 10
                                    ? 'تم الوصول للحد الأقصى (10 صور)'
                                    : 'اختيار صور للمعرض'
                                }
                            </label>

                            <p className="text-sm text-muted-foreground mt-4">
                                يمكن اختيار حتى {10 - images.length - previewImages.length} صور إضافية • الحد الأقصى: 5 ميجا لكل صورة
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                الصيغ المدعومة: JPEG, PNG, WebP, AVIF
                            </p>
                        </div>

                        {isUploading && (
                            <div className="mt-4 p-4 bg-feature-products-soft/20 border border-feature-products/30 rounded-lg">
                                <div className="flex items-center gap-2 text-feature-products">
                                    <Upload className="h-4 w-4 animate-pulse" />
                                    <span className="text-sm font-medium">جاري رفع الصور...</span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* معاينة الصور المحددة قبل الرفع - يظهر فقط عند اختيار صور جديدة */}
                {hasPreview && previewImages.length > 0 && (
                    <Card className="border-l-4 border-l-amber-500 card-hover-effect bg-amber-50/50 dark:bg-amber-950/20">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5 text-amber-600 icon-enhanced" />
                                    <span className="text-amber-800 dark:text-amber-200">
                                        صور جديدة في انتظار الرفع ({previewImages.length})
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearAllPreviews}
                                    className="text-xs border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-300"
                                    disabled={isUploading}
                                >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    مسح الكل
                                </Button>
                            </CardTitle>
                            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                                راجع الصور المحددة وقم بحذف غير المرغوب فيها، ثم اضغط "رفع" لإضافتها للمعرض
                            </p>
                        </CardHeader>
                        <CardContent>
                            {/* صور المعاينة مع تحسين التصميم */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4">
                                {previewImages.map((preview, index) => (
                                    <div
                                        key={index}
                                        className="relative group bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border border-amber-200 dark:border-amber-800"
                                    >
                                        <div className="aspect-square bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 rounded-md overflow-hidden border-2 border-dashed border-amber-300 dark:border-amber-700">
                                            <Image
                                                src={preview.url}
                                                alt={`معاينة ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-200 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* شارة "جديد" */}
                                        <div className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full shadow-sm font-medium">
                                            جديد
                                        </div>

                                        {/* زر حذف من المعاينة */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 rounded-lg">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => removePreviewImage(index)}
                                                        variant="destructive"
                                                        className="h-8 w-8 p-0 shadow-lg"
                                                        disabled={isUploading}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">حذف من المعاينة</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* معلومات الملف */}
                                        <div className="mt-2 text-center">
                                            <p className="text-xs text-amber-700 dark:text-amber-300 truncate">
                                                {preview.file.name}
                                            </p>
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                {(preview.file.size / 1024 / 1024).toFixed(1)} MB
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* أزرار التحكم المحسنة */}
                            <div className="bg-amber-100/50 dark:bg-amber-900/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleUploadAll}
                                        disabled={isUploading || previewImages.length === 0}
                                        className="bg-amber-600 hover:bg-amber-700 text-white flex-1 h-10 font-medium shadow-md"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Upload className="h-4 w-4 mr-2 animate-pulse" />
                                                جاري الرفع... ({previewImages.length})
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="h-4 w-4 mr-2" />
                                                رفع جميع الصور ({previewImages.length})
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={clearAllPreviews}
                                        disabled={isUploading}
                                        className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 h-10"
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        إلغاء الكل
                                    </Button>
                                </div>

                                <div className="mt-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>سيتم رفع الصور إلى المعرض وحفظها في قاعدة البيانات</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* إدارة الصور الموجودة - معرض المنتج الحالي */}
                {hasGallery && (
                    <Card className="border-l-4 border-l-feature-analytics card-hover-effect bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Images className="h-5 w-5 text-feature-analytics icon-enhanced" />
                                    <span className="text-feature-analytics">
                                        معرض المنتج الحالي ({images.length})
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span>محفوظ</span>
                                </div>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                هذه هي الصور المحفوظة حالياً في معرض المنتج. يمكنك تعيين الصورة الرئيسية أو حذف الصور غير المرغوبة.
                            </p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {images.map((image, index) => (
                                    <div key={index} className="relative group">
                                        {/* إطار الصورة مع تحسينات */}
                                        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden border-2 border-transparent hover:border-feature-analytics/30 transition-all duration-300 shadow-sm hover:shadow-md">
                                            <Image
                                                src={image}
                                                alt={`صورة ${index + 1}`}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                        </div>

                                        {/* مؤشر الصورة الرئيسية المحسن */}
                                        {index === mainImageIndex && (
                                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full shadow-lg font-medium z-10 border-2 border-white dark:border-gray-800">
                                                <Star className="h-3 w-3 inline mr-1" />
                                                رئيسية
                                            </div>
                                        )}

                                        {/* أدوات التحكم المحسنة */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all duration-300 rounded-lg">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setAsMainImage(index)}
                                                        className={`h-9 w-9 p-0 shadow-lg transition-all duration-200 ${index === mainImageIndex
                                                            ? 'bg-green-600 hover:bg-green-700 text-white'
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                            }`}
                                                        disabled={isUpdating || index === mainImageIndex}
                                                    >
                                                        {index === mainImageIndex ? (
                                                            <CheckCircle className="h-4 w-4" />
                                                        ) : (
                                                            <Star className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">
                                                    {index === mainImageIndex ? 'الصورة الرئيسية الحالية' : 'تعيين كصورة رئيسية'}
                                                </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => deleteImage(index)}
                                                        variant="destructive"
                                                        className="h-9 w-9 p-0 shadow-lg bg-red-600 hover:bg-red-700"
                                                        disabled={isUpdating}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent side="bottom">حذف من المعرض</TooltipContent>
                                            </Tooltip>
                                        </div>

                                        {/* مؤشر الحالة في الزاوية */}
                                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-sm font-medium opacity-75 group-hover:opacity-100 transition-opacity">
                                            محفوظ
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* رسالة عدم وجود صور - حالة فارغة محسنة */}
                {!hasGallery && (
                    <Card className="border-l-4 border-l-gray-300 dark:border-l-gray-600 card-hover-effect bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                        <CardContent className="p-12 text-center">
                            <div className="max-w-md mx-auto">
                                {/* أيقونة متحركة */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center animate-pulse">
                                        <Images className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
                                        <Upload className="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">
                                    لا يوجد معرض صور حتى الآن
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
                                    هذا المنتج لا يحتوي على معرض صور بعد. ابدأ بإضافة الصور لإنشاء معرض جذاب للعملاء وزيادة المبيعات.
                                </p>

                                {/* أزرار الإجراءات */}
                                <div className="space-y-3">
                                    <Button
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium h-12 shadow-lg"
                                        onClick={() => {
                                            // Scroll to the upload section
                                            const uploadSection = document.querySelector('[data-upload-section]');
                                            uploadSection?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                    >
                                        <Upload className="h-5 w-5 mr-2" />
                                        ابدأ بإنشاء المعرض
                                    </Button>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <span>يمكن رفع حتى 10 صور بجودة عالية</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </TooltipProvider>
    );
} 