
interface ProductFilterFormProps {
    name: string;
    status: string;
    type: string;
    stock: string;
}

export default function ProductFilterForm({ name, status, type, stock }: ProductFilterFormProps) {
    return (
        <form className='mb-8 flex w-full flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row md:items-end' method="GET">
            <input
                type="text"
                name="name"
                placeholder="بحث باسم المنتج..."
                defaultValue={name}
                className="w-full rounded border border-input bg-input px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
            <select name="status" defaultValue={status} className="min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground">
                <option value='all'>كل الحالات</option>
                <option value='published'>منشور</option>
                <option value='unpublished'>غير منشور</option>
            </select>
            <select name="type" defaultValue={type} className="min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground">
                <option value='all'>كل الأنواع</option>
                <option value='company'>مورد</option>
                <option value='offer'>عرض</option>
            </select>
            <select name="stock" defaultValue={stock} className="min-w-[110px] rounded border border-input bg-input px-2 py-2 text-sm text-foreground">
                <option value='all'>كل المخزون</option>
                <option value='in'>متوفر</option>
                <option value='out'>غير متوفر</option>
            </select>
            <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">تصفية</button>
            <a href="/dashboard/management-products" className="text-primary underline px-2">إعادة تعيين</a>
        </form>
    );
} 