// app/dashboard/components/menuConfig.ts
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Gift,
  Handshake,
  Home,
  Info,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Newspaper,
  Package,
  PieChart,
  Settings,
  ShieldCheck,
  ShoppingBasket,
  Target,
  Timer,
  Truck,
  Users,
  Users2,
  Wrench,
  XCircle,
} from 'lucide-react';

export const menuGroups = [
  {
    label: 'الرئيسية', // Home / Overview
    items: [
      { title: 'لوحة المعلومات', url: '/dashboard', icon: LayoutDashboard },
      { title: 'عرض المتجر', url: '/', icon: Home },
    ],
  },
  {
    label: 'الطلبات', // Orders
    items: [
      { title: 'كل الطلبات', url: '/dashboard/orders-management', icon: Layers },
      { title: 'قيد المعالجة', url: '/dashboard/orders-management/status/pending', icon: Clock },
      { title: 'قيد التوصيل', url: '/dashboard/orders-management/status/in-way', icon: Truck },
      { title: 'تم التوصيل', url: '/dashboard/orders-management/status/delivered', icon: CheckCircle },
      { title: 'ملغاة', url: '/dashboard/orders-management/status/canceled', icon: XCircle },
    ],
  },
  {
    label: 'التقارير والتحليلات',
    items: [
      { title: 'نظرة عامة', url: '/dashboard/reports', icon: PieChart },
    ],
  },
  {
    label: 'إدارة الفريق',
    items: [
      { title: 'المشرفون', url: '/dashboard/user-mangment/admin', icon: Handshake },
      { title: 'المسوقون', url: '/dashboard/user-mangment/marketer', icon: Megaphone },
      { title: 'العملاء', url: '/dashboard/user-mangment/customer', icon: Users2 },
      { title: 'السائقون', url: '/dashboard/user-mangment/drivers', icon: Truck },
      { title: 'جداول العمل', url: '/dashboard/shifts', icon: Timer },
    ],
  },
  {
    label: 'المنتجات والمخزون',
    items: [
      { title: 'إدارة المنتجات', url: '/dashboard/products-control', icon: Package },
      { title: 'الأصناف', url: '/dashboard/categories', icon: LayoutGrid },
      { title: 'الموردون', url: '/dashboard/suppliers', icon: ShoppingBasket },
    ],
  },
  {
    label: 'التسويق والعروض',
    items: [
      { title: 'العروض الترويجية', url: '/dashboard/promotions', icon: Gift },
      { title: 'النشرة البريدية', url: '/dashboard/clientnews', icon: Newspaper },
      { title: 'المحتوى الإرشادي', url: '/seo/documentation', icon: FileText },
    ],
  },
  {
    label: 'تجربة العملاء',
    items: [
      { title: 'قائمة العملاء', url: '/dashboard/users', icon: Users2 },
      { title: 'رسائل العملاء', url: '/dashboard/clientsubmission', icon: Users },
    ],
  },
  {
    label: 'المعاملات المالية',
    items: [
      { title: 'سجل المصروفات', url: '/dashboard/expenses', icon: CreditCard },
    ],
  },
  {
    label: 'الإعدادات والنظام',
    items: [
      { title: 'الإعدادات العامة', url: '/dashboard/settings', icon: Settings },
      { title: 'الصلاحيات والمستخدمون', url: '/dashboard/users-permissions', icon: ShieldCheck },
      { title: 'الإشعارات والتنبيهات', url: '/dashboard/alerts', icon: AlertTriangle },
      { title: 'الدعم الفني', url: '/dashboard/maintinance', icon: Wrench },
      { title: 'الدليل والتعليمات', url: '/dashboard/guidelines', icon: Info },
      { title: 'تهيئة البيانات', url: '/dashboard/dataSeed', icon: Layers },
    ],
  },
  {
    label: 'تحسين محركات البحث (SEO)',
    items: [
      { title: 'تحليلات الأداء', url: '/dashboard/seo', icon: Target },
      { title: 'الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
      { title: 'صفحة من نحن', url: '/dashboard/seo/about', icon: Info },
      { title: 'مدونة الموقع', url: '/dashboard/seo/blog', icon: Newspaper },
      { title: 'صفحات المنتجات', url: '/dashboard/seo/product', icon: Package },
      { title: 'صفحات العروض', url: '/dashboard/seo/promotion', icon: Gift },
      { title: 'صفحات الأصناف', url: '/dashboard/seo/category', icon: LayoutGrid },
      { title: 'أداء SEO', url: '/dashboard/seo/performance', icon: PieChart },
    ],
  },
];
