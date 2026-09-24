'use client';

import React from 'react';
import { useShop } from '@/context/shop-context';
import { translations } from '@/lib/i18n';
import { LayoutDashboard, ShoppingCart, Wrench, Smartphone, BookOpen, Menu } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenQuickAction: () => void;
  onOpenMenu: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu
}) => {
  const { locale } = useShop();
  const t = translations[locale];

  const items = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'pos', label: t.nav_pos, icon: ShoppingCart },
    { id: 'service', label: t.nav_service, icon: Wrench },
    { id: 'banking', label: locale === 'bn' ? 'ব্যাংকিং' : 'Banking', icon: Smartphone },
    { id: 'dues', label: locale === 'bn' ? 'বাকি' : 'Dues', icon: BookOpen }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-md min-w-[56px] min-h-[44px] transition-colors ${
              isActive
                ? 'text-emerald-700 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
            <span className="text-[10px] mt-0.5 whitespace-nowrap leading-none truncate max-w-[64px]">
              {item.label}
            </span>
          </button>
        );
      })}

      <button
        onClick={onOpenMenu}
        aria-label="Open More Menu"
        className="flex flex-col items-center justify-center py-1.5 px-2 rounded-md min-w-[56px] min-h-[44px] text-slate-500 hover:text-slate-800"
      >
        <Menu className="w-5 h-5 text-slate-500" />
        <span className="text-[10px] mt-0.5 whitespace-nowrap leading-none">
          {locale === 'bn' ? 'মেনু' : 'Menu'}
        </span>
      </button>
    </div>
  );
};
