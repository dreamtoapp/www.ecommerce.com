'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingBag, User, Heart, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import { Session } from 'next-auth';

interface NavCategory {
    id: string;
    name: string;
    slug: string;
    hasSubmenu: boolean;
    isHot?: boolean;
    isNew?: boolean;
}

const mainCategories: NavCategory[] = [
    { id: 'women', name: 'نساء', slug: 'women', hasSubmenu: true, isHot: true },
    { id: 'men', name: 'رجال', slug: 'men', hasSubmenu: true },
    { id: 'kids', name: 'أطفال', slug: 'kids', hasSubmenu: true, isNew: true },
    { id: 'accessories', name: 'إكسسوارات', slug: 'accessories', hasSubmenu: true },
    { id: 'home', name: 'منزل', slug: 'home', hasSubmenu: true },
    { id: 'beauty', name: 'تجميل', slug: 'beauty', hasSubmenu: true, isHot: true },
    { id: 'sports', name: 'رياضة', slug: 'sports', hasSubmenu: true },
    { id: 'sale', name: 'تخفيضات', slug: 'sale', hasSubmenu: false, isHot: true }
];

interface EnhancedHeaderProps {
    session: Session | null;
    logo?: string;
    logoAlt?: string;
}

export default function EnhancedHeader({ session, logo, logoAlt }: EnhancedHeaderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    // Close mega menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            setIsMegaMenuOpen(false);
            setActiveCategory(null);
        };

        if (isMegaMenuOpen) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [isMegaMenuOpen]);

    const handleCategoryHover = (categoryId: string | null) => {
        if (categoryId) {
            setActiveCategory(categoryId);
            setIsMegaMenuOpen(true);
        } else {
            setIsMegaMenuOpen(false);
            setActiveCategory(null);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Implement search functionality
            console.log('Searching for:', searchQuery);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            {/* Top promotional bar */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm">
                <div className="container mx-auto px-4">
                    🔥 عروض خاصة: خصم 50% على مختارات مميزة - شحن مجاني للطلبات فوق 200 ر.س
                </div>
            </div>

            {/* Main header */}
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="p-2"
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                    </div>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        {logo ? (
                            <Image
                                src={logo}
                                alt={logoAlt || 'Logo'}
                                width={120}
                                height={40}
                                className="h-8 w-auto"
                            />
                        ) : (
                            <div className="text-2xl font-bold text-feature-products">
                                متجرنا
                            </div>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
                        {mainCategories.map((category) => (
                            <div
                                key={category.id}
                                className="relative"
                                onMouseEnter={() => category.hasSubmenu && handleCategoryHover(category.id)}
                            >
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-feature-products hover:bg-gray-50 ${activeCategory === category.id ? 'text-feature-products bg-gray-50' : 'text-gray-700'
                                        }`}
                                >
                                    {category.name}
                                    {category.isHot && (
                                        <Badge className="bg-red-500 text-white text-xs px-1 py-0.5 ml-1">
                                            HOT
                                        </Badge>
                                    )}
                                    {category.isNew && (
                                        <Badge className="bg-green-500 text-white text-xs px-1 py-0.5 ml-1">
                                            NEW
                                        </Badge>
                                    )}
                                </Link>
                            </div>
                        ))}
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <form onSubmit={handleSearch} className="relative w-full">
                            <Input
                                type="search"
                                placeholder="ابحث عن المنتجات..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border-gray-300 focus:border-feature-products focus:ring-feature-products"
                            />
                            <Button
                                type="submit"
                                variant="ghost"
                                size="sm"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1"
                            >
                                <Search className="h-4 w-4 text-gray-400" />
                            </Button>
                        </form>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        {/* Language Selector */}
                        <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-1">
                            <Globe className="h-4 w-4" />
                            <span className="text-sm">العربية</span>
                        </Button>

                        {/* Wishlist */}
                        <Button variant="ghost" size="sm" className="relative">
                            <Heart className="h-5 w-5" />
                            {wishlistCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </Badge>
                            )}
                        </Button>

                        {/* Shopping Cart */}
                        <Button variant="ghost" size="sm" className="relative">
                            <ShoppingBag className="h-5 w-5" />
                            {cartItemsCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 bg-feature-products text-white text-xs min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                                    {cartItemsCount}
                                </Badge>
                            )}
                        </Button>

                        {/* User Account */}
                        <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                            <User className="h-5 w-5" />
                            {session ? (
                                <span className="text-sm">حسابي</span>
                            ) : (
                                <span className="text-sm">دخول</span>
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mega Menu */}
            <MegaMenu
                isOpen={isMegaMenuOpen}
                activeCategory={activeCategory}
                onCategoryHover={handleCategoryHover}
                onClose={() => {
                    setIsMegaMenuOpen(false);
                    setActiveCategory(null);
                }}
            />

            {/* Mobile Menu */}
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                session={session}
            />
        </header>
    );
} 