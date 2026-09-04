"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('jane@example.com');
  const [password, setPassword] = useState('CuratedWardrobe2025!');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', icon: '' });

  const showToast = (message: string, iconName = 'check_circle') => {
    setToast({ visible: true, message, icon: iconName });
    setTimeout(() => {
      setToast(t => ({ ...t, visible: false }));
    }, 3500);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Login failed', 'error');
        setIsLoading(false);
        return;
      }

      showToast('Welcome back. Redirecting to your curation...', 'check_circle');
      router.push('/');
      router.refresh(); // Refresh the layout to update auth state
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
      setIsLoading(false);
    }
  };

  const handleMagicLink = () => {
    if (!email) {
      showToast('Please specify an email address first.', 'error');
      return;
    }
    showToast('Magic Link dispatched to ' + email, 'forward_to_inbox');
  };

  const handlePasskeyPrompt = () => {
    showToast('Touch ID / Windows Hello requested...', 'fingerprint');
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      <header className="w-full py-space-xl flex justify-center items-center">
        <Link className="flex items-center gap-space-sm" href="/">
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">ShopEra</span>
        </Link>
      </header>

      <main className="w-full flex-grow flex items-center justify-center px-margin-mobile">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-6xl mx-auto my-auto py-space-lg lg:py-space-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg lg:gap-gutter-desktop items-stretch">
              {/* Left Column */}
              <div className="hidden lg:flex lg:col-span-5 flex-col justify-between relative rounded-lg overflow-hidden p-space-2xl min-h-[660px] shadow-xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  data-alt="High-end editorial fashion photography of a model in an oversized natural linen coat..." 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuATZi-MeQM0okQKhaI6_VG4tV2mwNbzzSFOIbmSa7mHbl8wEMbuC70RctmDysYm-nGMEQkF3TJW0n2Ojv_A32cGpP75_x_iJFzbDTrUN0GNO_yAlc9zbjnc-fAw-syhzYSGYbGGz07_4P90Hdre-MZz9LltYl8yNcjmbfqy1rT2xePca_rck7UOOLDmHx8ohb8a7S-GukfyI0cc49rMa0gkF3q1EOV9Zu6zQotSmpIwK9VDS3jw0gUA")' }}
                >
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/90 via-on-surface/40 to-transparent"></div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface text-label-sm font-label-sm uppercase tracking-wider shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Member Haven
                  </span>
                  <span className="text-surface-bright/75 font-caption text-caption uppercase tracking-widest">
                    Autumn / Winter &apos;25
                  </span>
                </div>
                
                <div className="relative z-10 space-y-space-xl text-on-primary">
                  <div className="space-y-space-sm">
                    <p className="font-caption text-caption tracking-widest uppercase text-secondary-fixed opacity-90">Exclusive Privileges</p>
                    <blockquote className="font-headline-md text-headline-md font-semibold tracking-tight leading-snug">
                      &ldquo;Curated essentials for intentional living.&rdquo;
                    </blockquote>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
                    <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest/15 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-space-xs text-secondary-fixed mb-space-xxs">
                        <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                        <span className="font-label-sm text-label-sm font-semibold">Priority Entry</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-bright/80">48h early reservation to limited drops</p>
                    </div>
                    <div className="p-space-md rounded-DEFAULT bg-surface-container-lowest/15 backdrop-blur-md shadow-sm">
                      <div className="flex items-center gap-space-xs text-secondary-fixed mb-space-xxs">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                        <span className="font-label-sm text-label-sm font-semibold">ShopEra Pay</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-bright/80">5% perpetual credit on every checkout</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-space-xs opacity-75 font-caption text-caption">
                    <span>Archival Access • Concierge Care</span>
                    <span>Ed. No. 04</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
                <div className="w-full max-w-lg mx-auto bg-surface-container-lowest rounded-lg p-space-xl sm:p-space-2xl shadow-xl space-y-space-xl">
                  <div className="space-y-space-xs">
                    <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container text-primary text-caption font-caption uppercase tracking-wider mb-space-xs">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Encrypted Portal
                    </div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                      Welcome back
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Enter your credentials to access your curated wardrobe, active orders, and membership rewards.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-space-sm">
                    <button className="group h-12 px-space-md rounded-full bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex items-center justify-center gap-space-sm shadow-sm" type="button">
                      <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                        <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" fill="#4285F4"></path>
                        <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z" fill="#34A853"></path>
                        <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"></path>
                        <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" fill="#EA4335"></path>
                      </svg>
                      <span className="font-label-md text-label-md text-on-surface group-hover:text-on-surface font-medium">Google</span>
                    </button>
                    <button className="group h-12 px-space-md rounded-full bg-surface-container-low hover:bg-surface-container transition-colors duration-200 flex items-center justify-center gap-space-sm shadow-sm" type="button">
                      <svg className="w-5 h-5 flex-shrink-0 fill-on-surface" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z"></path>
                      </svg>
                      <span className="font-label-md text-label-md text-on-surface group-hover:text-on-surface font-medium">Apple</span>
                    </button>
                  </div>
                  
                  <div className="relative flex items-center justify-center">
                    <div className="w-full h-px bg-surface-container-highest"></div>
                    <span className="absolute px-space-md bg-surface-container-lowest text-on-surface-variant font-label-sm text-label-sm">
                      or continue with email
                    </span>
                  </div>
                  
                  <form className="space-y-space-md" onSubmit={handleLoginSubmit}>
                    <div className="space-y-space-xxs">
                      <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">Email address</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px] pointer-events-none">mail</span>
                        <input 
                          className="w-full h-12 pl-12 pr-space-md rounded-full bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline" 
                          id="email" 
                          name="email" 
                          placeholder="jane@example.com" 
                          required 
                          type="email" 
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-space-xxs">
                      <div className="flex items-center justify-between">
                        <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                        <Link className="font-label-sm text-label-sm text-secondary hover:text-on-secondary-container transition-colors" href="#">
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-space-md text-on-surface-variant text-[20px] pointer-events-none">lock</span>
                        <input 
                          className="w-full h-12 pl-12 pr-12 rounded-full bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-outline" 
                          id="password" 
                          name="password" 
                          placeholder="••••••••••••" 
                          required 
                          type={showPassword ? 'text' : 'password'} 
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                        <button 
                          aria-label="Toggle password visibility" 
                          className="absolute right-space-md text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center p-1 rounded-full" 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-space-xxs">
                      <label className="relative flex items-center gap-space-xs cursor-pointer select-none">
                        <input defaultChecked className="sr-only peer" id="remember-me" type="checkbox" />
                        <div className="w-5 h-5 rounded bg-surface-container-low peer-checked:bg-on-surface peer-checked:text-surface-bright flex items-center justify-center transition-all shadow-sm">
                          <span className="material-symbols-outlined text-[16px] text-surface-bright opacity-0 peer-checked:opacity-100 transition-opacity">check</span>
                        </div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant peer-checked:text-on-surface">Remember this device</span>
                      </label>
                      <button 
                        className="inline-flex items-center gap-1 text-caption font-caption text-primary cursor-pointer hover:underline" 
                        type="button" 
                        onClick={handleMagicLink}
                      >
                        <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                        Use Magic Link
                      </button>
                    </div>
                    
                    <button 
                      className="w-full h-12 rounded-full bg-on-surface text-surface-bright font-label-md text-label-md hover:bg-inverse-surface active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-space-xs shadow-md mt-space-sm" 
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          <span>Signing In...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>
                  
                  <div className="p-space-sm rounded-DEFAULT bg-surface-container-low flex items-center justify-between gap-space-sm">
                    <div className="flex items-center gap-space-xs min-w-0">
                      <span className="material-symbols-outlined text-primary text-[22px] flex-shrink-0">fingerprint</span>
                      <div className="min-w-0">
                        <p className="font-label-sm text-label-sm text-on-surface truncate">Passkey &amp; Biometrics</p>
                        <p className="font-caption text-caption text-on-surface-variant truncate">Fast zero-password authentication</p>
                      </div>
                    </div>
                    <button 
                      className="flex-shrink-0 px-space-md py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high font-label-sm text-label-sm text-on-surface transition-colors" 
                      type="button"
                      onClick={handlePasskeyPrompt}
                    >
                      Verify
                    </button>
                  </div>
                  
                  <div className="text-center pt-space-xs">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      New to ShopEra? 
                      <Link className="font-semibold text-secondary hover:text-on-secondary-container transition-colors ml-1 underline decoration-secondary/30 underline-offset-4" href="/register">
                        Create an account
                      </Link>
                    </p>
                  </div>
                </div>
                
                {toast.visible && (
                  <div className="fixed bottom-6 right-6 z-50 max-w-sm p-space-md rounded-DEFAULT bg-inverse-surface text-inverse-on-surface shadow-xl flex items-center gap-space-sm animate-in fade-in slide-in-from-bottom-4">
                    <span className="material-symbols-outlined text-secondary-fixed">{toast.icon}</span>
                    <span className="font-body-sm text-body-sm">{toast.message}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="w-full py-space-xl text-center text-on-surface-variant font-caption text-caption">
        <p>© 2025 ShopEra Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}
