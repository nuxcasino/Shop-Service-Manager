'use client';

import React from 'react';
import { useShop } from '@/context/shop-context';
import { translations, formatCurrency } from '@/lib/i18n';
import {
  LayoutDashboard,
  ShoppingCart,
  Smartphone,
  Wrench,
  Printer,
  Package,
  BookOpen,
  Receipt,
  BarChart3,
  Settings,
  AlertTriangle,
  Wallet
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const {
    locale,
    role,
    business,
    activeServiceJobsCount,
    lowStockProducts,
    currentCashInDrawer
  } = useShop();
  const t = translations[locale];

  // Map modules to business category settings
  const navItems = [
    {
      id: 'dashboard',
      label: t.nav_dashboard,
      icon: LayoutDashboard,
      alwaysShow: true
    },
    {
      id: 'pos',
      label: t.nav_pos,
      icon: ShoppingCart,
      categoryKey: 'pos',
      alwaysShow: true
    },
    {
      id: 'banking',
      label: t.nav_banking,
      icon: Smartphone,
      categoryKey: 'banking'
    },
    {
      id: 'service',
      label: t.nav_service,
      icon: Wrench,
      categoryKey: 'service',
      badge: activeServiceJobsCount > 0 ? activeServiceJobsCount : undefined,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'computer',
      label: t.nav_computer,
      icon: Printer,
      categoryKey: 'computer'
    },
    {
      id: 'inventory',
      label: t.nav_inventory,
      icon: Package,
      categoryKey: 'accessories', // or electrical or seasonal
      badge: lowStockProducts.length > 0 ? lowStockProducts.length : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    {
      id: 'dues',
      label: t.nav_dues,
      icon: BookOpen,
      categoryKey: 'dues',
      alwaysShow: true
    },
    {
      id: 'expenses',
      label: t.nav_expenses,
      icon: Receipt,
      categoryKey: 'pos',
      hideForStaff: role === 'staff'
    },
    {
      id: 'reports',
      label: t.nav_reports,
      icon: BarChart3,
      alwaysShow: role === 'owner',
      hideForStaff: role === 'staff'
    },
    {
      id: 'settings',
      label: t.nav_settings,
      icon: Settings,
      alwaysShow: true
    }
  ];

  // Filter modules based on shop category selection & staff role
  const filteredNavItems = navItems.filter((item) => {
    if (item.hideForStaff) return false;
    if (item.alwaysShow) return true;
    if (item.categoryKey && business.categories) {
      if (item.id === 'inventory') {
        return (
          business.categories.includes('accessories') ||
          business.categories.includes('electrical') ||
          business.categories.includes('seasonal')
        );
      }
      return business.categories.includes(item.categoryKey);
    }
    return true;
  });

  return (
    <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-[calc(100vh-57px)]">
      {/* Navigation List */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-600 tracking-wider">
          {locale === 'bn' ? 'দোকান মডিউল' : 'SHOP MODULES'}
        </div>

        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                  : 'text-slate-700 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Cash in Drawer & Alerts Widget */}
      <div className="p-3 border-t border-slate-200 bg-white/60 space-y-2">
        {lowStockProducts.length > 0 && (
          <button
            onClick={() => setActiveTab('inventory')}
            className="w-full flex items-center gap-2 p-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-left text-xs"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <div className="truncate">
              <span className="font-semibold block truncate">
                {locale === 'bn'
                  ? `${lowStockProducts.length}টি পণ্যের স্টক কম`
                  : `${lowStockProducts.length} low stock items`}
              </span>
              <span className="text-[10px] text-amber-700">
                {locale === 'bn' ? 'স্টক রিফিল করুন' : 'Click to review stock'}
              </span>
            </div>
          </button>
        )}

        <div className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-slate-600" />
              <span>{t.cash_in_drawer}</span>
            </span>
          </div>
          <div className="text-base font-bold text-slate-900 font-mono tabular-nums">
            {formatCurrency(currentCashInDrawer, locale)}
          </div>
        </div>
      </div>
    </aside>
  );
};
