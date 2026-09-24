'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { signOut } from '@/lib/auth-client';
import { AuthModal } from './auth-modal';
import {
  User,
  LogOut,
  LogIn,
  ShieldCheck,
  ChevronDown,
  Database,
  CheckCircle,
} from 'lucide-react';

export const UserProfileBadge: React.FC = () => {
  const { sessionUser, isDatabaseConnected, isNeon, locale, refreshUserData } =
    useShop();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'signin' | 'signup'>('signin');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isBn = locale === 'bn';

  const handleSignOut = async () => {
    try {
      setLoggingOut(true);
      await signOut();
      setDropdownOpen(false);
      await refreshUserData();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoggingOut(false);
    }
  };

  if (!sessionUser) {
    return (
      <>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              setModalMode('signin');
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 rounded-lg transition-colors shadow-2xs whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{isBn ? 'সাইন ইন' : 'Sign In'}</span>
          </button>
        </div>

        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultMode={modalMode}
        />
      </>
    );
  }

  // User is authenticated
  return (
    <>
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
            {sessionUser.name ? sessionUser.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="hidden md:block max-w-[120px] lg:max-w-[160px] truncate">
            <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
              {sessionUser.name || sessionUser.email}
            </p>
            <p className="text-[10px] text-emerald-700 font-medium truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isNeon ? 'Neon DB' : 'Better Auth'}
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {dropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setDropdownOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 zoom-in-95">
              <div className="px-3.5 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {sessionUser.name}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {sessionUser.email}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                    <ShieldCheck className="w-3 h-3" />
                    {isBn ? 'দোকান মালিক' : 'Owner'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                    <Database className="w-3 h-3" />
                    {isNeon ? 'Neon PostgreSQL' : 'Session Active'}
                  </span>
                </div>
              </div>

              <div className="px-3.5 py-2 text-[11px] text-slate-500 bg-slate-50/70 border-b border-slate-100">
                <div className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>
                    {isBn ? 'ইউজার আইসোলেশন সক্রিয়' : 'Strict User Data Isolation'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ID: {sessionUser.id.slice(0, 12)}...
                </p>
              </div>

              <button
                onClick={handleSignOut}
                disabled={loggingOut}
                className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>
                  {loggingOut
                    ? isBn
                      ? 'লগআউট হচ্ছে...'
                      : 'Signing out...'
                    : isBn
                    ? 'লগআউট করুন'
                    : 'Sign Out'}
                </span>
              </button>
            </div>
          </>
        )}
      </div>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultMode={modalMode}
      />
    </>
  );
};
