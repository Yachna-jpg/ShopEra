"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [preference, setPreference] = useState('womens');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Cura7!onStudio$');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', icon: '' });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const showToast = (message: string, iconName = 'check_circle') => {
    setToast({ visible: true, message, icon: iconName });
    setTimeout(() => {
      setToast(t => ({ ...t, visible: false }));
    }, 3500);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const name = `${firstName} ${lastName}`.trim();

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.error || 'Registration failed', 'error');
        setIsLoading(false);
        return;
      }

      // Log in automatically after registration
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        showToast('Registration successful, but login failed', 'error');
        setIsLoading(false);
        return;
      }

      showToast('Account created successfully. Redirecting...', 'check_circle');
      router.push('/');
      router.refresh();
    } catch (err) {
      showToast('An unexpected error occurred', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen flex flex-col justify-between">
      <header className="w-full py-space-xl flex justify-center items-center">
        <Link className="flex items-center gap-space-sm" href="1.png">
          <span className="font-headline-md text-headline-md text-on-surface tracking-tight font-bold">ShopEra</span>
        </Link>
      </header>
      <main className="w-full flex-grow flex items-center justify-center px-margin-mobile">
        <div className="flex flex-col w-full">
          <div className="w-full max-w-[1360px] mx-auto pb-space-4xl px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl lg:gap-gutter-desktop items-stretch">
              {/* Left Column: Editorial Showcase */}
              <div className="lg:col-span-5 relative flex flex-col justify-between overflow-hidden rounded-lg bg-surface-container-low min-h-[580px] lg:min-h-[760px] p-space-lg md:p-space-2xl shadow-sm">
                <div className="absolute inset-0 z-0">
                  <img
                    className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out hover:scale-100"
                    alt="High-end editorial fashion photography"
                    src="/images/1.png"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent"></div>
                </div>
                {/* Editorial Top Badge */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="inline-flex items-center gap-space-xxs px-space-md py-space-xs rounded-full bg-surface-container-lowest/90 backdrop-blur-md shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface">Member Edition № 08</span>
                  </span>
                  <span className="font-caption text-caption text-surface-container-lowest tracking-widest uppercase opacity-80">SS 2025</span>
                </div>
                {/* Editorial Bottom Highlight Card */}
                <div className="relative z-10 flex flex-col gap-space-md">
                  <div className="p-space-lg rounded-DEFAULT bg-surface-container-lowest/85 backdrop-blur-xl shadow-xl flex flex-col gap-space-sm">
                    <div className="flex items-center gap-space-xs">
                      <div className="flex -space-x-2 overflow-hidden">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-caption">E</span>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-caption">K</span>
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface-container-highest text-on-surface font-label-sm text-caption">M</span>
                      </div>
                      <span className="font-label-sm text-label-sm text-on-surface font-medium">Join 50,000+ conscious shoppers</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Enjoy <span className="text-secondary font-semibold font-label-md">15% off</span> your inaugural bespoke order with private invite voucher:
                    </p>
                    <div className="flex items-center justify-between px-space-md py-space-xs rounded-full bg-surface-container-low">
                      <span className="font-label-md text-label-md tracking-wider text-on-surface select-all">WELCOME15</span>
                      <span className="font-caption text-caption text-secondary font-semibold uppercase tracking-wider">Applied at checkout</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-surface-container-lowest/80 font-caption text-caption px-space-xs">
                    <span>Slow Luxury &amp; Organic Textures</span>
                    <span>Carbon Neutral Delivery</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Registration Form Container */}
              <div className="lg:col-span-7 flex flex-col justify-center bg-surface-container-lowest rounded-lg p-space-lg sm:p-space-2xl lg:p-space-3xl shadow-sm">
                <div className="max-w-[560px] mx-auto w-full flex flex-col gap-space-xl">
                  {/* Header Titles */}
                  <div className="flex flex-col gap-space-xs">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-semibold">Join ShopEra House</span>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Create your account</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">Join our global community for curated collections, conscious fashion drops, and private salon member perks.</p>
                  </div>
                  
                  {/* Social Quick Signups */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                    <button onClick={() => signIn('google', { callbackUrl: '/' })} className="group flex items-center justify-center gap-space-sm h-12 px-space-lg rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors duration-200" type="button">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                      </svg>
                      <span className="font-label-md text-label-md">Google</span>
                    </button>
                    <button className="group flex items-center justify-center gap-space-sm h-12 px-space-lg rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container transition-colors duration-200" type="button">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.05-1.81.93-2.88-.9.04-2 .6-2.64 1.36-.58.68-1.09 1.76-.95 2.81 1.01.08 2.04-.53 2.66-1.29z"></path>
                      </svg>
                      <span className="font-label-md text-label-md">Apple ID</span>
                    </button>
                  </div>
                  
                  {/* Divider */}
                  <div className="relative flex items-center justify-center">
                    <div className="w-full h-px bg-surface-container-high"></div>
                    <span className="absolute bg-surface-container-lowest px-space-md font-caption text-caption uppercase text-outline tracking-wider">or sign up with email</span>
                  </div>
                  
                  {/* Interactive Form */}
                  <form className="flex flex-col gap-space-md" id="signup-form" onSubmit={handleRegisterSubmit}>
                    {/* Name Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      <div className="flex flex-col gap-space-xxs">
                        <label className="font-label-sm text-label-sm text-on-surface-variant ml-space-xs" htmlFor="first-name">First Name</label>
                        <input className="h-12 px-space-lg rounded-full bg-surface-container-low text-on-surface placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-body-md font-body-md" id="first-name" placeholder="Julian" required type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
                      </div>
                      <div className="flex flex-col gap-space-xxs">
                        <label className="font-label-sm text-label-sm text-on-surface-variant ml-space-xs" htmlFor="last-name">Last Name</label>
                        <input className="h-12 px-space-lg rounded-full bg-surface-container-low text-on-surface placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-body-md font-body-md" id="last-name" placeholder="Vane" required type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
                      </div>
                    </div>
                    
                    {/* Email Address */}
                    <div className="flex flex-col gap-space-xxs">
                      <label className="font-label-sm text-label-sm text-on-surface-variant ml-space-xs" htmlFor="email">Email Address</label>
                      <input className="h-12 px-space-lg rounded-full bg-surface-container-low text-on-surface placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-body-md font-body-md" id="email" placeholder="julian.vane@domain.com" required type="email" value={email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    
                    {/* Password & Strength Meter */}
                    <div className="flex flex-col gap-space-xs">
                      <div className="flex flex-col gap-space-xxs">
                        <div className="flex items-center justify-between ml-space-xs mr-space-xs">
                          <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                          <span className="font-caption text-caption text-outline">At least 8 characters</span>
                        </div>
                        <div className="relative">
                          <input 
                            className="w-full h-12 pl-space-lg pr-12 rounded-full bg-surface-container-low text-on-surface placeholder:text-outline/60 focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-body-md font-body-md" 
                            id="password" 
                            placeholder="••••••••••••" 
                            required 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                          />
                          <button 
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface flex items-center justify-center p-1" 
                            type="button"
                            onClick={handleTogglePassword}
                          >
                            <span className="material-symbols-outlined text-headline-sm select-none">
                              {showPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Visual Password Strength Indicator */}
                      <div className="flex flex-col gap-space-xxs px-space-xs pt-space-xxs">
                        <div className="grid grid-cols-4 gap-space-xs">
                          <div className="h-1.5 rounded-full bg-primary transition-all duration-300"></div>
                          <div className="h-1.5 rounded-full bg-primary transition-all duration-300"></div>
                          <div className="h-1.5 rounded-full bg-primary transition-all duration-300"></div>
                          <div className="h-1.5 rounded-full bg-primary transition-all duration-300"></div>
                        </div>
                        <div className="flex items-center justify-between text-caption font-caption pt-0.5">
                          <span className="text-on-surface-variant font-medium">Security strength</span>
                          <span className="text-primary font-semibold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px]">check_circle</span>
                            Strong &amp; resilient
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Style Preference Selection */}
                    <div className="flex flex-col gap-space-xs pt-space-xxs">
                      <label className="font-label-sm text-label-sm text-on-surface-variant ml-space-xs">Style Preference <span className="text-outline font-normal">(Optional)</span></label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs" id="preference-group">
                        <button 
                          className={`h-10 px-space-md rounded-full font-label-sm text-label-sm text-center transition-all duration-150 ${preference === 'womens' ? 'bg-on-surface text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`} 
                          type="button"
                          onClick={() => setPreference('womens')}
                        >
                          Women&apos;s
                        </button>
                        <button 
                          className={`h-10 px-space-md rounded-full font-label-sm text-label-sm text-center transition-all duration-150 ${preference === 'mens' ? 'bg-on-surface text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`} 
                          type="button"
                          onClick={() => setPreference('mens')}
                        >
                          Men&apos;s
                        </button>
                        <button 
                          className={`h-10 px-space-md rounded-full font-label-sm text-label-sm text-center transition-all duration-150 ${preference === 'home' ? 'bg-on-surface text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`} 
                          type="button"
                          onClick={() => setPreference('home')}
                        >
                          Home &amp; Living
                        </button>
                        <button 
                          className={`h-10 px-space-md rounded-full font-label-sm text-label-sm text-center transition-all duration-150 ${preference === 'all' ? 'bg-on-surface text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`} 
                          type="button"
                          onClick={() => setPreference('all')}
                        >
                          Curate All
                        </button>
                      </div>
                    </div>
                    
                    {/* Checkboxes & Consents */}
                    <div className="flex flex-col gap-space-sm pt-space-xs">
                      <label className="flex items-start gap-space-sm cursor-pointer group">
                        <input defaultChecked className="mt-1 w-4 h-4 rounded text-on-surface accent-on-surface cursor-pointer rounded-DEFAULT" type="checkbox"/>
                        <span className="font-body-sm text-body-sm text-on-surface-variant select-none">
                          Receive our weekly curated journal, private capsule invites, and secret early access drops.
                        </span>
                      </label>
                      <label className="flex items-start gap-space-sm cursor-pointer group">
                        <input defaultChecked className="mt-1 w-4 h-4 rounded text-on-surface accent-on-surface cursor-pointer rounded-DEFAULT" required type="checkbox"/>
                        <span className="font-body-sm text-body-sm text-on-surface-variant select-none">
                          I agree to ShopEra&apos;s <Link className="text-on-surface font-semibold underline underline-offset-4 hover:text-secondary transition-colors" href="#">Terms of Service</Link> and <Link className="text-on-surface font-semibold underline underline-offset-4 hover:text-secondary transition-colors" href="#">Privacy Policy</Link>.
                        </span>
                      </label>
                    </div>
                    
                    {/* Primary Action CTA */}
                    <div className="pt-space-xs flex flex-col gap-space-sm">
                      <button 
                        className="w-full h-12 rounded-full bg-on-surface text-surface-container-lowest font-label-md text-label-md flex items-center justify-center gap-space-xs hover:bg-on-surface/90 active:scale-[0.99] transition-all duration-200 shadow-md" 
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <span className="material-symbols-outlined animate-spin text-headline-sm">progress_activity</span>
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Create Account</span>
                            <span className="material-symbols-outlined text-headline-sm">arrow_forward</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  {/* Trust Signals */}
                  <div className="grid grid-cols-2 gap-space-md pt-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-primary text-headline-sm">lock</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">256-Bit SSL</span>
                        <span className="font-caption text-caption text-on-surface-variant">Encrypted secure sign-up</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-headline-sm">published_with_changes</span>
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-on-surface font-semibold">Complimentary Returns</span>
                        <span className="font-caption text-caption text-on-surface-variant">30 days in-store or mail</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Switcher */}
                  <div className="pt-space-sm text-center border-t-0">
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Already a member of ShopEra? 
                      <Link className="text-on-surface font-semibold hover:text-secondary underline underline-offset-4 transition-colors ml-1" href="/login">Sign in here</Link>
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
