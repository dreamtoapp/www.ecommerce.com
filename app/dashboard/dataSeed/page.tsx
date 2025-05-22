'use client';

import { useEffect, useState } from 'react';
import { Database, Layers, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { SeedingProgress, getProgress, startSeeding } from './actions';

const defaultSeedingConfig = {
    drivers: 5,
    users: 5,
    suppliers: 4,
    categories: 4,
    products: 20,
    orders: 10,
    reviews: 30,
    wishlistItems: 20,
    shouldCleanup: true,
};

export default function DataSeedPage() {
    const [config, setConfig] = useState(defaultSeedingConfig);
    const [isSeeding, setIsSeeding] = useState(false);
    const [progress, setProgress] = useState<SeedingProgress[]>([]);

    const updateProgress = (step: string, status: SeedingProgress['status'], message?: string) => {
        setProgress(prev => {
            const existing = prev.find(p => p.step === step);
            if (existing) {
                return prev.map(p => p.step === step ? { ...p, status, message } : p);
            }
            return [...prev, { step, status, message }];
        });
    };

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isSeeding) {
            // Poll for progress updates every second
            intervalId = setInterval(async () => {
                const updates = await getProgress();
                updates.forEach(update => {
                    updateProgress(update.step, update.status, update.message);
                });

                // Check if all steps are completed or if there's an error
                const allCompleted = progress.every(p => p.status === 'completed');
                const hasError = progress.some(p => p.status === 'error');

                if (allCompleted || hasError) {
                    setIsSeeding(false);
                    if (allCompleted) {
                        toast.success('تم بذر البيانات بنجاح');
                    } else {
                        toast.error('حدث خطأ أثناء بذر البيانات');
                    }
                }
            }, 1000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [isSeeding, progress]);

    const handleSeeding = async () => {
        setIsSeeding(true);
        setProgress([]);

        try {
            const result = await startSeeding({ shouldCleanup: config.shouldCleanup });

            if (!result.success) {
                throw new Error(result.error || 'Failed to start seeding process');
            }

            // Initial progress updates will be handled by the useEffect
        } catch (error) {
            setIsSeeding(false);
            toast.error('فشل في بدء عملية بذر البيانات');
        }
    };

    const getProgressPercentage = () => {
        const completed = progress.filter(p => p.status === 'completed').length;
        const total = progress.length;
        return total > 0 ? (completed / total) * 100 : 0;
    };

    return (
        <div className="container mx-auto space-y-6 p-6">
            <div className="flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">بذر البيانات</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>إعدادات بذر البيانات</CardTitle>
                    <CardDescription>
                        قم بتكوين عدد العناصر التي تريد إنشاءها لكل نوع من البيانات
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="drivers">عدد السائقين</Label>
                            <Input
                                id="drivers"
                                type="number"
                                min="0"
                                value={config.drivers}
                                onChange={(e) => setConfig({ ...config, drivers: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="users">عدد المستخدمين</Label>
                            <Input
                                id="users"
                                type="number"
                                min="0"
                                value={config.users}
                                onChange={(e) => setConfig({ ...config, users: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="suppliers">عدد الموردين</Label>
                            <Input
                                id="suppliers"
                                type="number"
                                min="0"
                                value={config.suppliers}
                                onChange={(e) => setConfig({ ...config, suppliers: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="categories">عدد الأصناف</Label>
                            <Input
                                id="categories"
                                type="number"
                                min="0"
                                value={config.categories}
                                onChange={(e) => setConfig({ ...config, categories: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="products">عدد المنتجات</Label>
                            <Input
                                id="products"
                                type="number"
                                min="0"
                                value={config.products}
                                onChange={(e) => setConfig({ ...config, products: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="orders">عدد الطلبات</Label>
                            <Input
                                id="orders"
                                type="number"
                                min="0"
                                value={config.orders}
                                onChange={(e) => setConfig({ ...config, orders: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="reviews">عدد التقييمات</Label>
                            <Input
                                id="reviews"
                                type="number"
                                min="0"
                                value={config.reviews}
                                onChange={(e) => setConfig({ ...config, reviews: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="wishlistItems">عدد عناصر المفضلة</Label>
                            <Input
                                id="wishlistItems"
                                type="number"
                                min="0"
                                value={config.wishlistItems}
                                onChange={(e) => setConfig({ ...config, wishlistItems: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 space-x-reverse">
                        <Switch
                            id="cleanup"
                            checked={config.shouldCleanup}
                            onCheckedChange={(checked) => setConfig({ ...config, shouldCleanup: checked })}
                        />
                        <Label htmlFor="cleanup">تنظيف البيانات الموجودة قبل البذر</Label>
                    </div>

                    <Button
                        onClick={handleSeeding}
                        disabled={isSeeding}
                        className="w-full"
                    >
                        {isSeeding ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                جاري بذر البيانات...
                            </>
                        ) : (
                            <>
                                <Layers className="mr-2 h-4 w-4" />
                                بدء بذر البيانات
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {progress.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>تقدم العملية</CardTitle>
                        <CardDescription>
                            {getProgressPercentage().toFixed(0)}% مكتمل
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Progress value={getProgressPercentage()} />
                        <div className="space-y-2">
                            {progress.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="flex items-center gap-2">
                                        {step.status === 'completed' && (
                                            <div className="h-2 w-2 rounded-full bg-green-500" />
                                        )}
                                        {step.status === 'in-progress' && (
                                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                        )}
                                        {step.status === 'error' && (
                                            <div className="h-2 w-2 rounded-full bg-red-500" />
                                        )}
                                        {step.status === 'pending' && (
                                            <div className="h-2 w-2 rounded-full bg-gray-300" />
                                        )}
                                        <span>{step.step}</span>
                                    </div>
                                    {step.message && (
                                        <span className="text-sm text-muted-foreground">{step.message}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
} 