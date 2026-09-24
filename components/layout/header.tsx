'use client';

import React from 'react';
import { useShop } from '@/context/shop-context';
import { translations } from '@/lib/i18n';
import { 
  Store, 
  Languages, 
  UserCheck, 
  PlusCircle, 
  Sliders, 
  ShieldCheck, 
  Smartphone
} from 'lucide-react';
import { UserProfileBadge } from '@/components/auth/user-profile-badge';

interface HeaderProps {
  onOpenQuickAction: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuickAction,
  onOpenSettings,
  activeTab,
  setActiveTab
}) => {
  const { locale, setLocale, role, setRole, business } = useShop();
  const t = translations[locale];

  const primaryNavItems = [
    { id: 'dashboard', label: t.nav_dashboard },
    { id: 'pos', label: t.nav_pos },
    { id: 'service', label: t.nav_service },
    { id: 'banking', label: t.nav_banking },
    { id: 'dues', label: t.nav_dues }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200">
      {/* Zone 1: Single Text Element Brand Wordmark */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 text-left hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-tight block truncate max-w-[180px] sm:max-w-[280px]">
              {locale === 'bn' ? business.nameBn : business.nameEn}
            </span>
            <span className="text-[11px] text-slate-500 hidden sm:block truncate max-w-[240px]">
              {locale === 'bn' ? business.district : `${business.district}, Dhaka`} · ৳ BDT
            </span>
          </div>
        </button>
      </div>

      {/* Zone 2: 4-6 Clean Text Nav Links (Top Bar Contract) */}
      <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
        {primaryNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`transition-colors whitespace-nowrap py-1 ${
              activeTab === item.id
                ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                : 'hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Zone 3: 1-2 Primary Actions + Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language Switcher */}
        <button
          onClick={() => setLocale(locale === 'bn' ? 'en' : 'bn')}
          aria-label="Toggle Language"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap"
        >
          <Languages className="w-3.5 h-3.5 text-slate-500" />
          <span>{locale === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>

        {/* Role Switcher (Owner vs Staff) */}
        <button
          onClick={() => setRole(role === 'owner' ? 'staff' : 'owner')}
          title={t.switch_role}
          className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
            role === 'owner'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          {role === 'owner' ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <UserCheck className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>{role === 'owner' ? t.owner : t.staff}</span>
        </button>

        {/* Better Auth User Badge */}
        <UserProfileBadge />

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title={t.nav_settings}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
        >
          <Sliders className="w-4 h-4" />
        </button>

        {/* Primary Action CTA: Quick Action */}
        <button
          onClick={onOpenQuickAction}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">{t.quick_actions}</span>
          <span className="sm:hidden">{locale === 'bn' ? 'নতুন' : 'New'}</span>
        </button>
      </div>
    </header>
  );
};
