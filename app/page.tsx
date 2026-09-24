'use client';

import React, { useState } from 'react';
import { ShopProvider, useShop } from '@/context/shop-context';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MobileNav } from '@/components/layout/mobile-nav';
import { DashboardView } from '@/components/dashboard/dashboard-view';
import { PosView } from '@/components/pos/pos-view';
import { BankingView } from '@/components/banking/banking-view';
import { ServiceView } from '@/components/service/service-view';
import { ComputerView } from '@/components/computer/computer-view';
import { InventoryView } from '@/components/inventory/inventory-view';
import { DuesView } from '@/components/dues/dues-view';
import { ExpensesView } from '@/components/expenses/expenses-view';
import { ReportsView } from '@/components/reports/reports-view';
import { SettingsView } from '@/components/settings/settings-view';
import { QuickActionModal } from '@/components/common/quick-action-modal';
import { OnboardingModal } from '@/components/settings/onboarding-modal';
import { translations } from '@/lib/i18n';
import {
  X,
  LayoutDashboard,
  ShoppingCart,
  Smartphone,
  Wrench,
  Printer,
  Package,
  BookOpen,
  Receipt,
  BarChart3,
  Settings
} from 'lucide-react';

function ShopApp() {
  const { mounted, locale, role, business } = useShop();
  const t = translations[locale];

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isOnboardingOpen = !business.isConfigured && !isOnboardingDismissed;

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans">
        {/* Skeleton Top Bar */}
        <div className="h-16 bg-white border-b border-slate-200 animate-pulse px-4 flex items-center justify-between">
          <div className="h-7 w-48 bg-slate-200 rounded-md" />
          <div className="h-8 w-32 bg-slate-200 rounded-lg" />
        </div>
        <div className="flex flex-1">
          {/* Skeleton Sidebar */}
          <div className="hidden md:block w-64 bg-white border-r border-slate-200 p-4 space-y-2">
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
            <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
          </div>
          {/* Skeleton Main View */}
          <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full space-y-4">
            <div className="h-20 bg-white rounded-xl border border-slate-200 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
              <div className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
              <div className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
              <div className="h-24 bg-white rounded-xl border border-slate-200 animate-pulse" />
            </div>
            <div className="h-64 bg-white rounded-xl border border-slate-200 animate-pulse" />
          </main>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { id: 'pos', label: t.nav_pos, icon: ShoppingCart },
    { id: 'banking', label: t.nav_banking, icon: Smartphone },
    { id: 'service', label: t.nav_service, icon: Wrench },
    { id: 'computer', label: t.nav_computer, icon: Printer },
    { id: 'inventory', label: t.nav_inventory, icon: Package },
    { id: 'dues', label: t.nav_dues, icon: BookOpen },
    { id: 'expenses', label: t.nav_expenses, icon: Receipt, hideForStaff: role === 'staff' },
    { id: 'reports', label: t.nav_reports, icon: BarChart3, hideForStaff: role === 'staff' },
    { id: 'settings', label: t.nav_settings, icon: Settings }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/60 font-sans">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onOpenSettings={() => setActiveTab('settings')}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Viewport Content */}
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-7 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeTab === 'pos' && <PosView />}

          {activeTab === 'banking' && <BankingView />}

          {activeTab === 'service' && <ServiceView />}

          {activeTab === 'computer' && <ComputerView />}

          {activeTab === 'inventory' && <InventoryView />}

          {activeTab === 'dues' && <DuesView />}

          {activeTab === 'expenses' && <ExpensesView />}

          {activeTab === 'reports' && role === 'owner' && <ReportsView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onOpenMenu={() => setIsMobileMenuOpen(true)}
      />

      {/* Mobile Menu Drawer Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-2xs md:hidden">
          <div 
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-menu-title"
            className="w-full bg-white rounded-t-2xl p-5 border-t border-slate-200 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h2 id="mobile-menu-title" className="text-base font-bold text-slate-900">
                {locale === 'bn' ? 'সকল মডিউল ও মেনু' : 'All Modules & Menu'}
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {menuItems
                .filter((item) => !item.hideForStaff)
                .map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-colors ${
                        isActive
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSelectAction={(action) => setActiveTab(action)}
      />

      {/* Onboarding / Business Setup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingDismissed(true)}
        isInitial={!business.isConfigured}
      />
    </div>
  );
}

export default function Page() {
  return (
    <ShopProvider>
      <ShopApp />
    </ShopProvider>
  );
}
