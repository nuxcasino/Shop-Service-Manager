'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/shop-context';
import { signIn, signUp } from '@/lib/auth-client';
import {
  Mail,
  User,
  Store,
  KeyRound,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
}) => {
  const { locale, refreshUserData } = useShop();
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isBn = locale === 'bn';

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        const res = await signIn.email({
          email,
          password,
        });

        if (res.error) {
          setErrorMessage(
            res.error.message ||
              (isBn
                ? 'ইমেইল অথবা পাসওয়ার্ড সঠিক নয়'
                : 'Invalid email or password')
          );
          setLoading(false);
          return;
        }

        setSuccessMessage(
          isBn ? 'সফলভাবে লগইন হয়েছে!' : 'Successfully signed in!'
        );
        await refreshUserData();
        setTimeout(() => {
          handleClose();
        }, 600);
      } else {
        // Sign Up
        if (!name.trim()) {
          setErrorMessage(
            isBn ? 'অনুগ্রহ করে আপনার নাম দিন' : 'Please provide your name'
          );
          setLoading(false);
          return;
        }

        const res = await signUp.email({
          email,
          password,
          name,
        });

        if (res.error) {
          setErrorMessage(
            res.error.message ||
              (isBn
                ? 'রেজিস্ট্রেশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
                : 'Registration failed. Please try again.')
          );
          setLoading(false);
          return;
        }

        setSuccessMessage(
          isBn
            ? 'অ্যাকাউন্ট তৈরি সফল হয়েছে! প্রবেশ করা হচ্ছে...'
            : 'Account created successfully! Logging in...'
        );
        await refreshUserData();
        setTimeout(() => {
          handleClose();
        }, 600);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMessage(
        err.message ||
          (isBn
            ? 'সার্ভারে সমস্যা হয়েছে, কিছুক্ষণ পর চেষ্টা করুন'
            : 'Network or server error. Please try again.')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const demoEmail = 'owner@dokankhata.demo';
    const demoPassword = 'Password123!';

    try {
      // Try sign-in first
      const res = await signIn.email({
        email: demoEmail,
        password: demoPassword,
      });

      // If doesn't exist, sign up demo user
      if (res.error) {
        const upRes = await signUp.email({
          email: demoEmail,
          password: demoPassword,
          name: 'রাশেদুল ইসলাম (দোকান মালিক)',
        });
        if (upRes.error) {
          setErrorMessage(upRes.error.message || 'Demo login failed');
          setLoading(false);
          return;
        }
      }

      setSuccessMessage(
        isBn
          ? 'ডেমো অ্যাকাউন্টে প্রবেশ করা হয়েছে!'
          : 'Signed in to Demo Shop Account!'
      );
      await refreshUserData();
      setTimeout(() => {
        handleClose();
      }, 500);
    } catch (err: any) {
      console.error('Demo auth error:', err);
      setErrorMessage(err.message || 'Demo account initialization failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in-50 zoom-in-95 my-auto"
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          <div className="text-center space-y-2 pb-2">
            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'signin'
                ? isBn
                  ? 'দোকান অ্যাকাউন্টে সাইন ইন'
                  : 'Sign In to DokanKhata'
                : isBn
                ? 'নতুন দোকান অ্যাকাউন্ট খুলুন'
                : 'Create Shop Account'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'নিরাপদ Neon PostgreSQL ও Better Auth সমন্বিত ডেটা আইসোলেশন'
                : 'Strict user-isolated data backed by Neon PostgreSQL & Better Auth'}
            </p>
          </div>

          {/* Security / Isolation Badge */}
          <div className="flex items-center justify-center gap-2 py-1.5 px-3 mt-3 bg-emerald-50 border border-emerald-200/70 rounded-lg text-emerald-800 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? 'প্রতিটি ইউজারের তথ্য সম্পূর্ণ আলাদা ও সুরক্ষিত'
                : 'End-to-end user-level data isolation & authorization'}
            </span>
          </div>

          {/* Error / Success Alerts */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 mt-3 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}
          {successMessage && (
            <div className="flex items-start gap-2 p-3 mt-3 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? 'আপনার নাম' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder={
                      isBn ? 'উদা: মোঃ আরিফুল ইসলাম' : 'e.g. Ariful Islam'
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'ইমেইল অ্যাড্রেস' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isBn ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              {mode === 'signup' && (
                <p className="text-[11px] text-slate-500 mt-1">
                  {isBn
                    ? 'কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড দিন'
                    : 'Must be at least 6 characters'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-sm transition-colors shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <span>{isBn ? 'অপেক্ষা করুন...' : 'Processing...'}</span>
              ) : (
                <>
                  <span>
                    {mode === 'signin'
                      ? isBn
                        ? 'লগইন করুন'
                        : 'Sign In'
                      : isBn
                      ? 'নিবন্ধন সম্পন্ন করুন'
                      : 'Create Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">
                {isBn ? 'অথবা' : 'Or'}
              </span>
            </div>
          </div>

          {/* 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>
              {isBn
                ? '১-ক্লিকে টেস্ট ডেমো অ্যাকাউন্টে প্রবেশ'
                : '1-Click Test Demo Account Login'}
            </span>
          </button>

          {/* Toggle Mode */}
          <div className="text-center text-xs text-slate-500 pt-3">
            {mode === 'signin' ? (
              <p>
                {isBn ? 'অ্যাকাউন্ট নেই? ' : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('signup');
                  }}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  {isBn ? 'নতুন তৈরি করুন' : 'Sign Up'}
                </button>
              </p>
            ) : (
              <p>
                {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? ' : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setMode('signin');
                  }}
                  className="text-emerald-700 font-semibold hover:underline"
                >
                  {isBn ? 'সাইন ইন করুন' : 'Sign In'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
