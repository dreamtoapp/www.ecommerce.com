// app/dashboard/components/menuConfig.ts
import {
  Activity,
  Bell,
  BookOpen,
  CalendarClock,
  CheckCircle,
  ClipboardList,
  Clock,
  CreditCard,
  Database,
  Gauge,
  Headset,
  Home,
  Info,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Mailbox,
  Megaphone,
  Newspaper,
  Package,
  SearchCheck,
  Settings,
  ShieldCheck,
  Store,
  Tag,
  Tags,
  Truck,
  Users,
  Warehouse,
  XCircle,
} from 'lucide-react';

// export const menuGroups = [
//   {
//     label: 'الرئيسية', // Home / Overview
//     items: [
//       { title: 'لوحة المعلومات', url: '/dashboard', icon: LayoutDashboard },
//       { title: 'عرض المتجر', url: '/', icon: Home },
//     ],
//   },
//   {
//     label: 'الطلبات', // Orders
//     items: [
//       { title: 'كل الطلبات', url: '/dashboard/orders-management', icon: Layers },
//       { title: 'قيد المعالجة', url: '/dashboard/orders-management/status/pending', icon: Clock },
//       { title: 'قيد التوصيل', url: '/dashboard/orders-management/status/in-way', icon: Truck },
//       { title: 'تم التوصيل', url: '/dashboard/orders-management/status/delivered', icon: CheckCircle },
//       { title: 'ملغاة', url: '/dashboard/orders-management/status/canceled', icon: XCircle },
//     ],
//   },
//   {
//     label: 'التقارير والتحليلات',
//     items: [
//       { title: 'نظرة عامة', url: '/dashboard/reports', icon: PieChart },
//     ],
//   },
//   {
//     label: 'إدارة الفريق',
//     items: [
//       { title: 'المشرفون', url: '/dashboard/user-mangment/admin', icon: Handshake },
//       { title: 'المسوقون', url: '/dashboard/user-mangment/marketer', icon: Megaphone },
//       { title: 'العملاء', url: '/dashboard/user-mangment/customer', icon: Users2 },
//       { title: 'السائقون', url: '/dashboard/user-mangment/drivers', icon: Truck },
//       { title: 'جداول العمل', url: '/dashboard/shifts', icon: Timer },
//     ],
//   },
//   {
//     label: 'المنتجات والمخزون',
//     items: [
//       { title: 'إدارة المنتجات', url: '/dashboard/products-control', icon: Package },
//       { title: 'الأصناف', url: '/dashboard/categories', icon: LayoutGrid },
//       { title: 'الموردون', url: '/dashboard/suppliers', icon: ShoppingBasket },
//     ],
//   },
//   {
//     label: 'التسويق والعروض',
//     items: [
//       { title: 'العروض الترويجية', url: '/dashboard/promotions', icon: Gift },
//       { title: 'النشرة البريدية', url: '/dashboard/clientnews', icon: Newspaper },
//       { title: 'المحتوى الإرشادي', url: '/seo/documentation', icon: FileText },
//     ],
//   },
//   {
//     label: 'تجربة العملاء',
//     items: [

//       { title: 'رسائل العملاء', url: '/dashboard/clientsubmission', icon: Users },
//     ],
//   },
//   {
//     label: 'المعاملات المالية',
//     items: [
//       { title: 'سجل المصروفات', url: '/dashboard/expenses', icon: CreditCard },
//     ],
//   },
//   {
//     label: 'الإعدادات والنظام',
//     items: [
//       { title: 'الإعدادات العامة', url: '/dashboard/settings', icon: Settings },

//       { title: 'الإشعارات والتنبيهات', url: '/dashboard/alerts', icon: AlertTriangle },
//       { title: 'الدعم الفني', url: '/dashboard/maintinance', icon: Wrench },
//       { title: 'الدليل والتعليمات', url: '/dashboard/guidelines', icon: Info },
//       { title: 'تهيئة البيانات', url: '/dashboard/dataSeed', icon: Layers },
//     ],
//   },
//   {
//     label: 'تحسين محركات البحث (SEO)',
//     items: [
//       { title: 'تحليلات الأداء', url: '/dashboard/seo', icon: Target },
//       { title: 'الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
//       { title: 'صفحة من نحن', url: '/dashboard/seo/about', icon: Info },
//       { title: 'مدونة الموقع', url: '/dashboard/seo/blog', icon: Newspaper },
//       { title: 'صفحات المنتجات', url: '/dashboard/seo/product', icon: Package },
//       { title: 'صفحات العروض', url: '/dashboard/seo/promotion', icon: Gift },
//       { title: 'صفحات الأصناف', url: '/dashboard/seo/category', icon: LayoutGrid },
//       { title: 'أداء SEO', url: '/dashboard/seo/performance', icon: PieChart },
//     ],
//   },
// ];
export const menuGroups = [
  {
    label: 'اللوحة الرئيسية',
    items: [
      { title: 'ملخص الأداء', url: '/dashboard', icon: LayoutDashboard }, // Changed to "Performance Summary"
      { title: 'معاينة المتجر', url: '/', icon: Store }, // Changed to "Store Preview"
    ],
  },
  {
    label: 'إدارة الطلبات',
    items: [
      { title: 'سجل الطلبات', url: '/dashboard/orders-management', icon: ClipboardList }, // Changed icon
      { title: 'طلبات قيد المراجعة', url: '/dashboard/orders-management/status/pending', icon: Clock },
      { title: 'طلبات قيد التوصيل', url: '/dashboard/orders-management/status/in-way', icon: Truck },
      { title: 'طلبات مكتملة', url: '/dashboard/orders-management/status/delivered', icon: CheckCircle },
      { title: 'طلبات ملغاة', url: '/dashboard/orders-management/status/canceled', icon: XCircle },
    ],
  },
  {
    label: 'إدارة المنتجات',
    items: [
      { title: 'المخزون', url: '/dashboard/management-products', icon: Package }, // Changed to "Inventory"
      { title: 'التصنيفات', url: '/dashboard/management-categories', icon: Tags }, // Changed icon
      { title: 'إدارة الموردين', url: '/dashboard/management-suppliers', icon: Warehouse },
    ],
  },
  {
    label: 'إدارة العملاء',
    items: [
      { title: 'سجل العملاء', url: '/dashboard/management-users/customer', icon: Users },
      { title: 'طلبات الدعم', url: '/dashboard/clientsubmission', icon: Headset }, // Changed icon
    ],
  },
  {
    label: 'إدارة الفريق',
    items: [
      { title: 'المشرفون', url: '/dashboard/management-users/admin', icon: ShieldCheck }, // Changed icon
      { title: 'فرق التسويق', url: '/dashboard/management-users/marketer', icon: Megaphone },
      { title: 'إدارة السائقين', url: '/dashboard/management-users/drivers', icon: Truck },
      { title: 'جدولة المناوبات', url: '/dashboard/shifts', icon: CalendarClock },
    ],
  },
  {
    label: 'التسويق الرقمي',
    items: [
      { title: 'العروض الترويجية', url: '/dashboard/management-promotions', icon: Tag },
      { title: 'حملات البريد الإلكتروني', url: '/dashboard/clientnews', icon: Mailbox },
    ],
  },
  {
    label: 'التحليلات المتقدمة',
    items: [
      { title: 'تقارير الأداء', url: '/dashboard/management-reports', icon: Activity },
    ],
  },
  {
    label: 'المالية والمحاسبة',
    items: [
      { title: 'حركات المصروفات', url: '/dashboard/management-expenses', icon: CreditCard }, // Changed to "Expense Transactions"
    ],
  },
  {
    label: 'الإعدادات النظامية',
    items: [
      { title: 'الإعدادات العامة', url: '/dashboard/settings', icon: Settings },
      { title: 'إدارة التنبيهات', url: '/dashboard/management-notification', icon: Bell },
      { title: 'الدعم الفني', url: '/dashboard/management-maintinance', icon: LifeBuoy },
      { title: 'المرجع التشغيلي', url: '/dashboard/guidelines', icon: BookOpen },
      { title: 'إدارة البيانات', url: '/dashboard/dataSeed', icon: Database }, // Changed to "Data Management"
    ],
  },
  {
    label: 'تحسين محركات البحث',
    items: [
      { title: 'تحليل SEO الشامل', url: '/dashboard/seo', icon: SearchCheck }, // Changed icon
      { title: 'تحسين الصفحة الرئيسية', url: '/dashboard/seo/home', icon: Home },
      { title: 'صفحة من نحن', url: '/dashboard/seo/about', icon: Info },
      { title: 'إدارة المدونة', url: '/dashboard/seo/blog', icon: Newspaper },
      { title: 'تحسين صفحات المنتجات', url: '/dashboard/seo/product', icon: Package },
      { title: 'صفحات الترويج', url: '/dashboard/seo/promotion', icon: Tag },
      { title: 'تحسين التصنيفات', url: '/dashboard/seo/category', icon: LayoutGrid },
      { title: 'مقاييس الأداء', url: '/dashboard/seo/performance', icon: Gauge }, // Changed icon
    ],
  },
];