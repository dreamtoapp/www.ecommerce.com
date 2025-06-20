'use client';

import React, {
  ElementType,
  useState,
} from 'react'; // Import ElementType

import { ChevronsUpDown, Star, Clock, Bookmark } from 'lucide-react';
import { usePathname } from 'next/navigation';

import Link from '@/components/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarRail,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

import { menuGroups } from '../helpers/mainMenu';

// Define type for menu items
interface MenuItem { // Renamed BaseMenuItem to MenuItem
  title: string;
  url: string;
  icon: ElementType; // Type for React component like lucide icons
  children?: MenuItem[]; // Make children optional directly on MenuItem
}

// Enhanced menu item with color mapping
const getMenuItemColors = (groupIndex: number, itemTitle: string) => {
  const colorMap: Record<number, { border: string; text: string; bg: string }> = {
    0: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // Dashboard
    1: { border: 'border-l-feature-commerce', text: 'text-feature-commerce', bg: 'bg-feature-commerce-soft' }, // Orders
    2: { border: 'border-l-feature-products', text: 'text-feature-products', bg: 'bg-feature-products-soft' }, // Products
    3: { border: 'border-l-feature-users', text: 'text-feature-users', bg: 'bg-feature-users-soft' }, // Customers
    4: { border: 'border-l-feature-users', text: 'text-feature-users', bg: 'bg-feature-users-soft' }, // Team
    5: { border: 'border-l-feature-commerce', text: 'text-feature-commerce', bg: 'bg-feature-commerce-soft' }, // Marketing
    6: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // Analytics
    7: { border: 'border-l-feature-suppliers', text: 'text-feature-suppliers', bg: 'bg-feature-suppliers-soft' }, // Finance
    8: { border: 'border-l-feature-settings', text: 'text-feature-settings', bg: 'bg-feature-settings-soft' }, // Settings
    9: { border: 'border-l-feature-analytics', text: 'text-feature-analytics', bg: 'bg-feature-analytics-soft' }, // SEO
  };
  return colorMap[groupIndex] || colorMap[8]; // Default to settings colors
};

export default function AppSidebar() {

  const side: 'left' | 'right' = 'right';
  const pathname = usePathname();
  const [collapsedGroups, setCollapsedGroups] = useState<number[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleGroup = (idx: number) => {
    setCollapsedGroups((groups) =>
      groups.includes(idx) ? groups.filter((i) => i !== idx) : [...groups, idx],
    );
  };

  const toggleFavorite = (url: string) => {
    setFavorites(prev =>
      prev.includes(url) ? prev.filter(fav => fav !== url) : [...prev, url]
    );
  };

  return (
    <Sidebar side={side} className='flex h-screen flex-col border-r bg-background rtl:text-right shadow-lg'>

      {/* Enhanced Header */}
      <SidebarHeader className='p-4 border-b bg-feature-analytics-soft'>
        <div className='flex items-center gap-2 mb-3'>
          <div className='h-8 w-8 rounded-lg bg-feature-analytics flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>ع</span>
          </div>
          <div className='flex-1'>
            <h2 className='font-bold text-lg text-feature-analytics'>لوحة التحكم</h2>
            <p className='text-xs text-muted-foreground'>إدارة متطورة</p>
          </div>
        </div>

        {/* Quick Access Favorites */}
        {favorites.length > 0 && (
          <div className='mt-3'>
            <p className='text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1'>
              <Star className='h-3 w-3' />
              المفضلة
            </p>
            <div className='flex flex-wrap gap-1'>
              {favorites.slice(0, 3).map(fav => {
                const favItem = menuGroups.flatMap(g => g.items).find(item => item.url === fav);
                return favItem ? (
                  <Link key={fav} href={fav}>
                    <Badge variant="secondary" className='text-xs hover:bg-feature-analytics-soft transition-colors'>
                      <favItem.icon className='h-3 w-3 mr-1' />
                      {favItem.title.slice(0, 8)}...
                    </Badge>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className='flex-1 overflow-y-auto p-2'>
        {menuGroups.map((group, i) => {
          const isCollapsed = collapsedGroups.includes(i);
          const colors = getMenuItemColors(i, group.label);

          return (
            <SidebarGroup key={i} className='mb-4'>
              {/* Enhanced Group Header */}
              <button
                className={`
                  flex w-full items-center justify-between px-3 py-3 text-sm font-semibold 
                  rounded-lg transition-all duration-200 hover:shadow-md card-hover-effect
                  ${colors.bg} ${colors.text} border ${colors.border.replace('border-l-', 'border-')}
                `}
                onClick={() => toggleGroup(i)}
                aria-expanded={!isCollapsed}
                aria-controls={`sidebar-group-${i}`}
              >
                <span className='text-right font-bold'>{group.label}</span>
                <div className='flex items-center gap-2'>
                  <Badge variant="outline" className='text-xs px-2 py-0.5'>
                    {group.items.length}
                  </Badge>
                  <span className={`transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`}>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </button>

              {/* Enhanced Menu Items */}
              <ul
                id={`sidebar-group-${i}`}
                className={`
                  space-y-1 overflow-hidden transition-all duration-300 mt-2
                  ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-96 opacity-100'}
                `}
                style={{ direction: 'rtl' }}
              >
                {group.items.map((item: MenuItem) => {
                  const isActive = pathname === item.url;
                  const isFavorite = favorites.includes(item.url);

                  return (
                    <React.Fragment key={item.url}>
                      <li>
                        <div className='relative group'>
                          <Link
                            href={item.url}
                            className={`
                              flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium 
                              transition-all duration-200 hover:shadow-md card-hover-effect
                              ${isActive
                                ? `${colors.bg} ${colors.text} ${colors.border} border-r-4 font-bold shadow-md`
                                : 'hover:bg-muted/50 hover:shadow-sm'
                              }
                            `}
                          >
                            <item.icon className={`h-5 w-5 icon-enhanced ${isActive ? colors.text : 'text-muted-foreground'}`} />
                            <span className='flex-1 text-sm font-semibold'>{item.title}</span>
                            {isActive && (
                              <div className={`h-2 w-2 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
                            )}
                          </Link>

                          {/* Favorite Toggle */}
                          <Button
                            variant="ghost"
                            size="sm"
                            className='absolute left-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0'
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(item.url);
                            }}
                          >
                            <Star
                              className={`h-3 w-3 ${isFavorite ? 'fill-feature-commerce text-feature-commerce' : 'text-muted-foreground'}`}
                            />
                          </Button>
                        </div>
                      </li>

                      {/* Enhanced Sub-menu */}
                      {item.children && item.children.length > 0 && (
                        <ul className='space-y-1 py-1 pr-4'>
                          {item.children.map((child) => {
                            const isChildActive = pathname === child.url;
                            return (
                              <li key={child.url}>
                                <Link
                                  href={child.url}
                                  className={`
                                    flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium 
                                    transition-all duration-200 hover:shadow-sm
                                    ${isChildActive
                                      ? `${colors.bg} ${colors.text} font-bold`
                                      : 'hover:bg-muted/30'
                                    }
                                  `}
                                >
                                  <child.icon className={`h-4 w-4 ${isChildActive ? colors.text : 'text-muted-foreground'}`} />
                                  <span>{child.title}</span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </React.Fragment>
                  );
                })}
              </ul>
            </SidebarGroup>
          );
        })}

      </SidebarContent>

      {/* Enhanced Footer */}
      <SidebarFooter className='border-t p-4 bg-muted/30'>
        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Clock className='h-3 w-3' />
            <span>آخر تحديث: الآن</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className='flex items-center gap-1'>
            <Bookmark className='h-3 w-3' />
            <span>{favorites.length} مفضلة</span>
          </div>
        </div>
        <div className='text-center text-xs text-muted-foreground mt-2'>
          © {new Date().getFullYear()} إدارة أمواج
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
