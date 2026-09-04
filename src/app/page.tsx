
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { apiFetch } from '@/lib/api';

export default function Home() {
  const { user, logout } = useAuth();
  const { cartCount, addToCart } = useCart();
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/api/products')
      .then(setProducts)
      .catch(console.error);
  }, []);

  const handleAddToCart = async (id: string) => {
    try {
      await addToCart(id);
      setToast({ visible: true, message: 'Added to bag!' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    } catch (e: any) {
      setToast({ visible: true, message: e.message || 'Failed to add to bag' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  };

  const handleWishlist = async (id: string) => {
    if (!user) {
      setToast({ visible: true, message: 'Please log in to add to wishlist' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
      return;
    }
    try {
      const res = await apiFetch('/api/wishlist', {
        method: 'POST',
        body: JSON.stringify({ productId: id })
      });
      setToast({ visible: true, message: res.message || 'Updated wishlist!' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    } catch (e: any) {
      setToast({ visible: true, message: e.message || 'Failed to update wishlist' });
      setTimeout(() => setToast({ visible: false, message: '' }), 3000);
    }
  };

  return (
    <>
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[100] px-4 py-2 bg-inverse-surface text-inverse-on-surface rounded shadow-xl animate-in fade-in">
          {toast.message}
        </div>
      )}
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(45,49,46,0.04)]"><div className="h-20 max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop flex items-center justify-between gap-gutter-desktop"><div className="flex items-center gap-space-sm flex-shrink-0"><img alt="ShopEra Brand Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WEub6MF4zc3twJfsx7SquOQpbntq-E-5gYikuD8Fscd5KMDdHJ2Jojzr0DByaCOIHgJ5yWFHhZuceObDeAzMMFohnmxj52f6IwRiPIuHKwAXof-k63dEqnBUkSy_H37cqMVk2RMWUKyr2qM7oPhrEezTfmi5bPq9X5vwBfzpoWwNgGAsngGXWmdFREs-VmkSNwEL5fBO4i9mhJFPNxHgmx8Z4wpOD3E5mySzAc7D-YDyXe9tcXFqzt1g"/><span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">ShopEra</span></div><nav className="hidden md:flex items-center gap-space-xl" data-active-classes="text-on-surface font-semibold"><Link aria-current="page" className="transition-colors text-on-surface font-semibold" data-path="shop" href="#">Shop</Link><Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="templates" href="#">Templates</Link><Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="language" href="#">Language</Link><Link className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors" data-path="categories" href="#">Categories</Link></nav><div className="flex items-center gap-space-xs sm:gap-space-sm flex-shrink-0"><button aria-label="Search" className="w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" type="button"><span className="material-symbols-outlined text-[22px]">search</span></button><Link aria-label="Wishlist" className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" data-path="wishlist" href="#"><span className="material-symbols-outlined text-[22px]">favorite</span></Link><Link aria-label="Shopping Cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors" data-path="shopping-cart" href="/cart"><span className="material-symbols-outlined text-[22px]">shopping_bag</span>{cartCount > 0 && <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-secondary text-on-secondary rounded-full font-caption text-caption flex items-center justify-center">{cartCount}</span>}</Link>
      {user ? (
        <div className="flex items-center ml-2">
          <span className="mr-2 text-sm">Hi, {user.name}</span>
          <button onClick={logout} className="text-sm font-semibold text-secondary hover:underline">Logout</button>
        </div>
      ) : (
        <Link href="/login" className="ml-2 text-sm font-semibold hover:underline">Sign In</Link>
      )}
      </div></div></header><main className="w-full pt-20 bg-background min-h-screen"><div className="flex flex-col w-full">
{/*  1. HERO SECTION  */}
<section className="relative w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl lg:py-space-3xl overflow-hidden">
<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-center">
{/*  Left Column: Copy & CTAs  */}
<div className="lg:col-span-6 flex flex-col items-start gap-space-md z-10">
<div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-secondary-fixed/40 text-on-secondary-fixed text-label-sm font-label-sm">
<span>In this season, find the best</span>
<span className="text-secondary text-base">✨</span>
</div>
<h1 className="font-display-xl text-display-xl text-on-surface tracking-tight leading-[1.08] max-w-xl">
          Exclusive collection for everyone
        </h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
          Thoughtfully designed everyday apparel and artisan lifestyle goods, rooted in conscious craft and understated elegance.
        </p>
<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<a className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface hover:bg-on-surface font-label-md text-label-md inline-flex items-center gap-space-xs transition-all transform hover:scale-[1.01] shadow-sm" data-path="shop" href="#">
<span>Explore shop now</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="h-12 px-space-xl rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md inline-flex items-center transition-colors" data-path="templates" href="#">
            View Lookbook
          </a>
</div>
{/*  Trust Proof Micro-badge  */}
<div className="flex items-center gap-space-md pt-space-sm">
<div className="flex -space-x-2">
<div className="w-9 h-9 rounded-full bg-surface-variant overflow-hidden ring-2 ring-surface">
<img className="w-full h-full object-cover" data-alt="Portrait of a modern fashionable woman smiling gently against a bright neutral studio backdrop, warm natural lighting, minimalist aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5EZKUe1Ko8o9VHGGvkDZYVuBrcZc8qXZ4hnbnoUmJ-mAT4RWJx567QaPoB-nTrGC1N-LesycN1OSkx-8Xh2cRAHvdl-mLN-6NMaoOroWokH50bfXvELFM2sdVBocz3cbW9b4FIQ6XwlUQh8N3PysqdQzDGznKW6W7RI11SG55xsZLTEQqzJ3uIE6aaTKvJqav8ECCqfhRnJmBTccFrKf6ai1OCvNr_zZqME_0EGCsATzplBRPGFLy"/>
</div>
<div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden ring-2 ring-surface">
<img className="w-full h-full object-cover" data-alt="Close up portrait of a young man wearing an earthy linen collar shirt, soft warm afternoon light, natural clean look" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRVzhqvuwTKai1dXNG-WepXtt8Ko_cZde1_x8FsWYm2_qzgB_ylSIs2YDoPfDwDaQq-Jn95PHnco8Aena6jsgNszNurNeksfz_HQ_oHY6MMC42exCldkWE9i0-X3VryQWrDF3mtDsLpAoafDg9eQI4jhqJYsX_C7qGaP4a4Uj00mNflJf3mC-iipsXPGlg2qlYAj5vhZ5Lj2Qe9uIQBurDgkSSCeRgW8zElFr2E1f05tRYP13abe6Q"/>
</div>
<div className="w-9 h-9 rounded-full bg-secondary-fixed overflow-hidden ring-2 ring-surface">
<img className="w-full h-full object-cover" data-alt="Stylish smiling woman with braided hair wearing minimalist ceramic earrings, soft neutral tones and soft cinematic shadows" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChron6jDupJ0JxClU0b6wHW5Bz6fcXw6xe9sYWnCsobu1Ifa96RrlUo75lCHxmVA5yfavzkWu4juGgjH1oCjr8eAASua_7RxQchjGdOQu59g1aoScnlSF5YkFzcVky7dmY06OL4P5ybD1YYALab68dUL5efygYx2Y83jCmwvVSyrPozT56aMSht3_FUy7sJOFNz0VXH_V8h8IEUV94frJAtl1zDV8Y9pEwmz7NWZK3o-NMgJaaV7kT"/>
</div>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[16px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-label-md text-label-md text-on-surface font-bold">4.9 / 5.0</span>
</div>
<span className="font-caption text-caption text-on-surface-variant">From 12,000+ satisfied shoppers</span>
</div>
</div>
</div>
{/*  Right Column: Organic Canvas Visual  */}
<div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px] lg:min-h-[560px]">
{/*  Soft Sage Organic Backdrop Backdrop Shape  */}
<div className="absolute w-[92%] h-[92%] rounded-[3.5rem] bg-primary-fixed/40 rotate-1 transform scale-95 blur-2xl -z-10"></div>
<div className="relative w-full max-w-lg aspect-[4/5] rounded-[3rem] overflow-hidden bg-primary-fixed/25 shadow-md flex items-end justify-center">
<img className="w-full h-full object-cover object-top" data-alt="Fashion editorial portrait of an elegant woman wearing a relaxed fit sage green linen blazer and off-white trousers, standing in an airy sunlit architectural studio with natural dried botanicals" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBw3ntvaY2-F9sJalWjutvqxegq2FWkO_xeJcKebYIHD6RdSCdbwmLXWuR8KcIC0oOQpTxZbAu_pD1GJAck3jkVX64Z9h1HHwZc4GTFXVoDeMrL4JnL1EfC6c9GIoygWY9LuvQIQX1wbnHbkQdnfwvoPhfIUImUEmYjWI4f3VIN9g1pF5Dmi2xhciGdpkvoi_PJdMFfIpP8f1tfnN6UC8_hYjTticzCFTDEM8ad6jEwvj1MdU871XbK"/>
{/*  Floating Pill Badges  */}
<div className="absolute top-6 left-6 px-4 py-2.5 rounded-full bg-surface/90 backdrop-blur-md shadow-sm flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide uppercase">Summer Drop &apos;25</span>
</div>
<div className="absolute bottom-8 left-6 px-4 py-3 rounded-2xl bg-surface/90 backdrop-blur-md shadow-sm flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed">
<span className="material-symbols-outlined text-[18px]">eco</span>
</div>
<div>
<p className="font-label-sm text-label-sm text-on-surface font-semibold">Pure Linen Blend</p>
<p className="font-caption text-caption text-on-surface-variant">100% GOTS Certified</p>
</div>
</div>
<div className="absolute top-1/3 right-4 px-3.5 py-2.5 rounded-full bg-inverse-surface/85 backdrop-blur-md text-inverse-on-surface shadow-md flex items-center gap-2">
<span className="material-symbols-outlined text-[18px] text-secondary-fixed">shopping_bag</span>
<span className="font-label-sm text-label-sm">Free Express Drop</span>
</div>
</div>
</div>
</div>
</section>
{/*  2. "DISCOVER MORE" PROMO STRIP  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="flex flex-col gap-space-lg">
<div>
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Curated Selections</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Discover more. Good things are waiting for you</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
{/*  Card 1: Warm Peach  */}
<div className="p-space-lg rounded-2xl bg-secondary-fixed/30 hover:bg-secondary-fixed/45 transition-colors flex flex-col justify-between min-h-[260px] relative overflow-hidden group shadow-sm">
<div className="relative z-10 flex flex-col gap-space-xs max-w-[65%]">
<span className="font-caption text-caption uppercase tracking-wider text-on-secondary-container font-semibold">Explore new arrivals</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Shop the latest from top brands</h3>
</div>
<div className="relative z-10 pt-space-md">
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold group-hover:gap-2.5 transition-all" data-path="shop" href="#">
<span>Show me all</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="absolute -right-4 -bottom-4 w-40 h-40 rounded-2xl overflow-hidden transform rotate-6 group-hover:rotate-3 group-hover:scale-105 transition-all duration-300">
<img className="w-full h-full object-cover" data-alt="Modern leather mini handbag in burnt sienna terracotta hue, resting on warm beige stone surface with clean soft lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvklEYOXTzijLFQ9G_lFOBtUm7UoizfGiWLzkEchPTNLh7KbFSjwLSEYCZUWuAL37Dyg2Nd7RSbGS-HGqgA4bCdHIOZySBpX_Xg2pvJXPINEHgCsBbV72iXfLL8Q9m0K9YP72sCEMBnxFezUjDSarGgmKvniytRTTpnKv7Xtem-wx7JtCIg_E2oHv5xhjlxDucsyj-VIDiFHvZzxlKCDyFHEMVvplF1eqRhe3Mf-AveS-p4ELSU_3p"/>
</div>
</div>
{/*  Card 2: Soft Cream  */}
<div className="p-space-lg rounded-2xl bg-surface-container hover:bg-surface-container-high transition-colors flex flex-col justify-between min-h-[260px] relative overflow-hidden group shadow-sm">
<div className="relative z-10 flex flex-col gap-space-xs max-w-[65%]">
<span className="font-caption text-caption uppercase tracking-wider text-primary font-semibold">Curated selection</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Up to 80% off retail</h3>
</div>
<div className="relative z-10 pt-space-md">
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold group-hover:gap-2.5 transition-all" data-path="shop" href="#">
<span>Show me all</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="absolute -right-4 -bottom-4 w-40 h-40 rounded-2xl overflow-hidden transform rotate-6 group-hover:rotate-3 group-hover:scale-105 transition-all duration-300">
<img className="w-full h-full object-cover" data-alt="Minimalist off-white knit sweater folded neatly over a smooth natural pine wooden hanger with gentle ambient studio light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDNNMTByKfXYY_w0bdBP1qrQxkNwPe-P36IMYrGjuwe4SKTS7yBNRNxOPblQ8bOp650RtaTSgoGVFp5RhiNSKxWdj0Q7unfEFB9g4KMaRp9Nqtsf36kh-SMOPNcAVX6GAVDUJv-o6i4YMk6AiqXX8JjeuL9kKV07q0h2Sceux6cuvMS0qQERHlDUiJC5z2RRorZOszhmt3ecz9T56Ck26UfZ8IsB-kzMStPP3whJI89oor7r4ifygX5"/>
</div>
</div>
{/*  Card 3: Soft Sage Mint  */}
<div className="p-space-lg rounded-2xl bg-primary-fixed/30 hover:bg-primary-fixed/45 transition-colors flex flex-col justify-between min-h-[260px] relative overflow-hidden group shadow-sm">
<div className="relative z-10 flex flex-col gap-space-xs max-w-[65%]">
<span className="font-caption text-caption uppercase tracking-wider text-on-primary-container font-semibold">Seasonal styles</span>
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Up to 90% off accessories</h3>
</div>
<div className="relative z-10 pt-space-md">
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold group-hover:gap-2.5 transition-all" data-path="shop" href="#">
<span>Show me all</span>
<span className="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>
</div>
<div className="absolute -right-4 -bottom-4 w-40 h-40 rounded-2xl overflow-hidden transform rotate-6 group-hover:rotate-3 group-hover:scale-105 transition-all duration-300">
<img className="w-full h-full object-cover" data-alt="Artisanal ceramic sunglasses with sage green acetate frames on soft canvas fabric, warm natural sun streaks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBccfvRYWQv5-20f3rVbkijMgxZG3-vLU_yMwM2jqZFSXVA3zDII6VJGRuuT2I5do0wBkWlF58TfPrdGd3lpqcqEBFSVSDica8aIPUPs4dQ4asjRIRL1xlqBUC3Md3eGP9eX0ZWIZk-E8XGrwrBf23GuYolz3sbld30qcVoaxYgaJx9tbvNrGEn7q3Y6ZFVsXSTJz3-MXa8UYx8n5SHJOfYlKD8ymK7MC_tu6X0_6QqKRpAKDop52tI"/>
</div>
</div>
</div>
</div>
</section>
{/*  3. NEW ARRIVALS GRID (REY BACKPACKS & BAGS)  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="flex items-end justify-between mb-space-xl">
<div>
<span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-semibold">Carry Essentials</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">New Arrivals. REY backpacks &amp; bags</h2>
</div>
<a className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-surface font-semibold transition-colors" data-path="shop" href="#">
<span>View all</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
{/*  Product 1  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="REY Urban Minimal Backpack in deep charcoal matte water-resistant canvas with sleek gunmetal hardware, standing on light gray concrete" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtZtKj2bSkyr39P5H-X5X0Q8jpzGfUCwV-lCPcwLJwGVgXvwB4J0SqVrXcLc1GFcVDk9QVvJWZo4YudT879PcCXEPV0SR7hVsSZ2rotDDTTIiRNwqjEElmEjofxwzi-DgXA4TFZ2lqukAKJTMqj0PVi2qFxD1wOKaW9_YT2mPJSsSSr_ymgSBNGVAXx6NBTOHn0UDq-IYQz9nifWBGVP4OgmrRi8qfAZekbjM5lrz--ZJKTDO_KxKW"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Save $42</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
{/*  Color Swatches  */}
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#2F3330] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#8FA89B]"></span>
<span className="w-4 h-4 rounded-full bg-[#C8A287]"></span>
</div>
<div className="flex items-baseline justify-between mt-1">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium">REY Urban Minimal Backpack</h3>
</div>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$148</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$190</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-tertiary">(128)</span>
</div>
</div>
</div>
</div>
{/*  Product 2  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="Ergonomic Daily Sling Bag in muted olive green with waterproof zipper tape, worn across the chest of a traveler in an airy train terminal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRapaIz_mrvA0-7C7qaAAQ7V4lXgbkBt96Tc5lD0bOBhpst7_L7DOlMO5hNODRLb-uB75LwJtvV6hwJkPfvKvfPbrmqa0l_-_mwdG1_AlfK3y1tjBNunwmmD--a6PuBCQvesdYRczxZWx1xK4oyMIiwFexR9PVNXMjZACxcZRymWUtxVAfNewIPqDyyCcqzCOTf16t0pICWpSVYSoMPIoRF_siI5UecXbxjQUTEYv0vpfrwdj5N20y"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Save $25</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#4C6358] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1A1A]"></span>
<span className="w-4 h-4 rounded-full bg-[#E79A78]"></span>
</div>
<div className="flex items-baseline justify-between mt-1">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium">Ergonomic Daily Sling Bag</h3>
</div>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$85</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$110</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.8</span>
<span className="text-tertiary">(94)</span>
</div>
</div>
</div>
</div>
{/*  Product 3  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" data-alt="Weekender Canvas Duffle Bag in heavy sand duck canvas with dark bridle leather handles and brass buckles, styled on a polished hardwood bench" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4x8qcF_r_vDvCHBFzjZ6VQ57H1IfnT4bp8ZrcuN7L1VAyoXZfrxt2j7dSeKAVDWW4HMQoosHsj8XKEPCZtPygC9CWicc1DvZkBdpcynPzDhgq0LdhkfH3nviqP4VAUHiItRvnl2g_nnsFKU24JYV8lAw6mnEZexlgfJ48A-3yQgA3cKwpoVdh6lNIV_B51jg0rgs-d9aIpm6PbdDFA9uwyxK19-ChkEYES5WnF57Te7aumZ5Mcadx"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption font-semibold">Bestseller</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#D6CEBF] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#273D33]"></span>
<span className="w-4 h-4 rounded-full bg-[#727974]"></span>
</div>
<div className="flex items-baseline justify-between mt-1">
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium">Weekender Canvas Duffle</h3>
</div>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$185</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$220</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">5.0</span>
<span className="text-tertiary">(210)</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  4. FEATURE ICONS ROW  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop p-space-xl rounded-3xl bg-surface-container-low">
{/*  Feature 1  */}
<div className="flex items-center gap-space-md">
<div className="w-14 h-14 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined text-[26px]">filter_list</span>
</div>
<div className="flex flex-col">
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Filter &amp; Discover</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Smart categorization &amp; effortless search</p>
</div>
</div>
{/*  Feature 2  */}
<div className="flex items-center gap-space-md">
<div className="w-14 h-14 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
<span className="material-symbols-outlined text-[26px]">shopping_bag</span>
</div>
<div className="flex flex-col">
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Add to Bag</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Fast 1-click checkout with secure payments</p>
</div>
</div>
{/*  Feature 3  */}
<div className="flex items-center gap-space-md">
<div className="w-14 h-14 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary flex-shrink-0">
<span className="material-symbols-outlined text-[26px]">local_shipping</span>
</div>
<div className="flex flex-col">
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Fast Shipping</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">Complimentary 2-day delivery over $75</p>
</div>
</div>
{/*  Feature 4  */}
<div className="flex items-center gap-space-md">
<div className="w-14 h-14 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-secondary flex-shrink-0">
<span className="material-symbols-outlined text-[26px]">verified</span>
</div>
<div className="flex flex-col">
<h4 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-base">Enjoy the Product</h4>
<p className="font-body-sm text-body-sm text-on-surface-variant">30-day effortless returns guarantee</p>
</div>
</div>
</div>
</section>
{/*  5. FINTECH / PROMO BANNER (Dark Slate Theme)  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl">
<div className="relative rounded-3xl bg-inverse-surface text-inverse-on-surface p-space-xl lg:p-space-3xl overflow-hidden shadow-xl">
{/*  Ambient Glow Decorators  */}
<div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl pointer-events-none"></div>
<div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none"></div>
<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
<div className="lg:col-span-7 flex flex-col gap-space-sm">
<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/30 text-primary-fixed-dim font-label-sm text-label-sm w-fit">
<span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
<span>ShopEra Pay Rewards</span>
</div>
<h2 className="font-display-xl text-display-xl tracking-tight text-inverse-on-surface">Earn free money with ShopEra</h2>
<p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-xl">
            Earn up to 5% instant cashback on every order with ShopEra Pay, plus exclusive reward tokens for community milestones and circular trade-ins.
          </p>
<div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
<a className="h-12 px-space-xl rounded-full bg-surface-bright text-on-surface hover:bg-surface-container font-label-md text-label-md inline-flex items-center gap-2 transition-transform hover:scale-[1.01]" data-path="shop" href="#">
<span>Exchange center</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
<a className="h-12 px-space-xl rounded-full bg-surface/10 hover:bg-surface/20 text-inverse-on-surface font-label-md text-label-md inline-flex items-center transition-colors" data-path="templates" href="#">
              Discover more
            </a>
</div>
</div>
{/*  Right Side Visual Graphic  */}
<div className="lg:col-span-5 flex justify-center lg:justify-end relative">
<div className="relative w-72 sm:w-80 h-72 rounded-2xl bg-surface-container-highest/10 backdrop-blur-md p-space-lg flex flex-col justify-between shadow-2xl">
{/*  Simulated Wallet Card Preview  */}
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-on-secondary font-headline-sm text-xs font-bold">S</span>
<span className="font-label-md text-label-md text-inverse-on-surface font-semibold">ERA Black Card</span>
</div>
<span className="material-symbols-outlined text-primary-fixed text-[24px]">contactless</span>
</div>
{/*  Cashback Credit Floating Pill  */}
<div className="p-3 rounded-xl bg-surface/15 backdrop-blur-md flex items-center justify-between transform -translate-y-2">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">payments</span>
</div>
<div>
<p className="font-caption text-caption text-inverse-on-surface/70">Instant Reward</p>
<p className="font-label-sm text-label-sm text-inverse-on-surface font-bold">+$25.00 credited</p>
</div>
</div>
<span className="text-xs px-2 py-0.5 rounded bg-primary-fixed/20 text-primary-fixed font-semibold">Settled</span>
</div>
<div className="flex items-end justify-between">
<div>
<p className="font-caption text-caption text-inverse-on-surface/60">Balance Accumulated</p>
<p className="font-headline-md text-headline-md text-inverse-on-surface font-bold">$1,248.60</p>
</div>
<span className="font-caption text-caption text-primary-fixed tracking-widest uppercase">Member Tier 3</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  6. "START EXPLORING" CATEGORY BROWSER  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-3xl">
<div className="flex flex-col items-center text-center gap-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Departments</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Start exploring.</h2>
{/*  Category Filter Tabs  */}
<div className="flex flex-wrap justify-center gap-2 mt-space-md">
<button className="category-pill-btn px-5 py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-medium shadow-sm" type="button">All</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Women</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Men</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Accessories</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Footwear</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Jewelry</button>
<button className="category-pill-btn px-5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors" type="button">Beauty</button>
</div>
</div>
{/*  2x3 Grid of Large Category Cards  */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
{/*  1. Accessories  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Curated collection of artisanal accessories including leather watch straps, horn combs, and brass keyholders neatly arranged on stone" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2YAab3DtuwMKkusu7iMNlfLBCh9mgnQOaJf4_lE0VINv1FaFP5VWq61-18r6q_CdDkQ-g1_YxHvl_WQK4SrL12hiwOdAt36kgWFBxCG1aZUWC2R6qiZsGC30noaez_WWOlYW2sfJ_IYKNAkyBQncHv5sWd4H2dDTfzlCb53tJJj_R-PR85dPG3LQy78TjsJdXTVxyU6zZQ-ybWZKcWHv5F0D_dnB1f1X97q_ZT5lqC6Syb6BDH3gC"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">Accessories</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">142 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
{/*  2. Jackets  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Model wearing structured lightweight utility jacket in warm olive green with matte silver horn buttons in natural daylight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQUVCujsBkSmioF8qYiM0xAEixKLGqLAeW1HNB9RGIT0t6UzCIoEmoP1UCfpVs2UzS57LnuMuGNaIJ8txrX46jc5NjLUyhF14-m_cUIYBtOpMJ-y4w-h3gF0LhJNQ7qoHO19fD6Wh_BYG9_UD5_3iLns52wPO-R5sG-o7U8huiZwneG_nn6zEbJUyY5oI_cw5-PHVs68I-d4IPhgVLTKGqBn46oGnmAqhZ_9iQrnZp1YvM8Lu_9YqZ"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">Jackets</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">88 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
{/*  3. Coats  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Tailored oversized wool trench coat in sand melange color worn effortlessly with dark charcoal mock neck sweater" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcp3OARyQsfNPO7Gw1Hn4bWap4WRKIoexiqq-qugqf2rDN3XNYzkh_rflS6VyQowHedhfUUoWa2VEvVm5vP36AxL53UTgKxotUn8xq0S1G1xnMFu_1bZKvi-ExyEqTCGfmom6H8GTEwT-JG3nhvp7Aae90E56H3e340sXVKA37ImjWhbt-hJswY5uIPpVPuA5f8wL4A330sLXPh5s7jIsidZNVBnI1Utx0VFeFVgkEmvxlgXpRPVHY"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">Coats</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">64 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
{/*  4. Jeans  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Selvedge denim jeans in raw indigo folded neatly on a wooden stool showing contrast red stitch detail and texture" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZjFCLdEa8PsbMmHWXoQAOvOg8RxXEJGBDBqh7DboWbmHRhrVksQMG6dwRAEJJgFmsBTwpGTt_TwaxMtWBISSPwTSL_dakHD8Q6n-lTn0HiYMcvy-O59lm3sj8gaVcCNU3j4grO5UQNupplPtqcCFRQ2EkcfA-nCPoa72snTlN5ceb85ATFG_bxqDkFwOSdM90FMAvay2f-1CPySP_ZKYYdI81p5mC2M5Ld2uzx-Az8qlJaLcgx8Cw"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">Jeans</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">95 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
{/*  5. Shoes  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Minimalist leather sneakers in chalk white and sand suede detail placed on architectural pedestal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDGrWTraXrHlsmkXni14RRSjEfEl35TYVlyfC2Xl-4FShQswBbcOCFe7pJ9FpLxEV1mXbNrS7abtXe2-9xL1yoOMpiDuqfxahitofi31qoH1OPIataPZ_wosnoDzbo-BBLZoTSCc-0jp6llRWyJnifKiHhA2V77Eo6pTOBxR4L2dP-wjpNKggXp6B6WMOtYptEXq4l4lgXzvt7ILd_jmkHnwEddZSwPlTYyoXvekDN66GZCNt-bbNR"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">Shoes</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">112 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
{/*  6. T-Shirts  */}
<a className="group relative rounded-2xl overflow-hidden bg-surface-container-low aspect-[4/3] flex flex-col justify-end p-space-lg shadow-sm hover:shadow-md transition-all" data-path="categories" href="#">
<img className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Stack of heavyweight organic cotton t-shirts in earthy tones: forest sage, warm cream, washed black, and clay terracotta" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPhowBmsa2VT9EQJfv_R5v4NWakikz4yDEEStwTIz8-hMybDnUM43rtO3iOdJSep-aHLmmD6E4tq_q3RFr3RllKWuNnoAHo8eTbEfBg2iXZOuijFch-cgicAkruSrj8OdQSRTUIsdxi4ZOI8LaFJ7ZYgm2w92Bme0C60v6_R7uIWKrjziFi2espfV3ogIOu3_PFQgTNfEz0HPI9iYhFv8oy2xyX2DnsvmfVe9N4ok219bgRqVdGmK"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-inverse-surface/20 to-transparent"></div>
<div className="relative z-10 flex items-center justify-between text-surface-bright">
<div>
<h3 className="font-headline-sm text-headline-sm font-semibold">T-Shirts</h3>
<p className="font-body-sm text-body-sm text-surface-variant/90">76 products</p>
</div>
<span className="w-10 h-10 rounded-full bg-surface/20 backdrop-blur-md flex items-center justify-center text-surface-bright group-hover:bg-surface group-hover:text-on-surface transition-colors">
<span className="material-symbols-outlined text-[20px]">north_east</span>
</span>
</div>
</a>
</div>
<div className="flex justify-center mt-space-2xl">
<a className="h-12 px-space-2xl rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md inline-flex items-center transition-colors" data-path="categories" href="#">
        Explore all collections
      </a>
</div>
</section>
{/*  7. BEST SELLERS SECTION  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="flex items-end justify-between mb-space-xl">
<div>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Community Favorites</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Best Sellers. Best selling of the month</h2>
</div>
<a className="hidden sm:inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:text-on-surface font-semibold transition-colors" data-path="shop" href="#">
<span>View all</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
{/*  Best Seller 1  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Model wearing luxurious Cashmere Minimalist Crewneck in oatmeal heather with relaxed fit silhouette in a warm lit Scandinavian interior" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAeNyzws5QeEe-z7PU_LMdrtQqtVJHfUB0WGTcQTGTkKRePb9aA_tHJkK1PYDOQQyijrqZyEgzRK1I9Kxnf65nc7X7SjGCTaB8YYz8IoKM6Eem2wzNDQLBKKZR1zXalD_jKalYihMLrxOCS-rJP6pG4R1Gqzvno9MnkHH1lrCctAaiZ06xWV5U06vQ1dyAlS0m3CYQKF6S2pUzd8CZbxIoIYLbIi9zX8nzPrpzJV_k1xn8f3vYWnPp3"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Save $40</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
<div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
<button className="w-full h-11 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 shadow-lg" type="button">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Quick Add to Bag</span>
</button>
</div>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#E5DFD7] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#3F4843]"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1A1A]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Cashmere Minimalist Crewneck</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$220</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$260</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-tertiary">(340)</span>
</div>
</div>
</div>
</div>
{/*  Best Seller 2  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Woman wearing oversized relaxed linen blazer in raw natural flax color with tortoiseshell buttons against a warm textured wall" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx36-bjx3I_fI9saNt-4zrzPzBjDCoyHZ4yzNgPCUP3wwXw7Al-2SvAr2tgQOgs_10P8TJfJd2BztANss9IuA5JsBV8ZxKFQnjq4hrvsORf3Op3zF_-vu7BppGz8n21mUC_nbSrzp3qqcBbYWCTlgffJtJ9iFSlT6Bxz5_TkgnF_VgRhejcriXs2wJ_GCY3lXKg5EZh11R0oAxhJZ8LcYHOWJHHhC3jTS45RW1LDMtezADxoCWHsnZ"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Save $45</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
<div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
<button className="w-full h-11 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 shadow-lg" type="button">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Quick Add to Bag</span>
</button>
</div>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#D4C8B8] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#FAF9F6]"></span>
<span className="w-4 h-4 rounded-full bg-[#24332C]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Oversized Linen Relaxed Blazer</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$195</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$240</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.8</span>
<span className="text-tertiary">(215)</span>
</div>
</div>
</div>
</div>
{/*  Best Seller 3  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Man wearing deep pine green Velvet Structured Overshirt layered open over a crisp off-white crewneck, relaxed contemporary style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRdAD5_5eD0YuRNK80GJR6JLU6L6BL7-mHx7aDxHXUipS7gV9n7Cd_fpTUk1_mUdZcypN7xGjKH9BvmBuuHiQ6j0CiQuDklMlgF_yInl6sILEI6XYV_RpUlWzA-XQaedF23rgrOU2K8FgY2jx0RZCRdpI6azWSQgWryp7GHngYED7Kk_HAxucnkS2UvF3yin5L7-pxPhzPc0FpMnBRThYHfKYHI60mtUngEAQFpLtYY1hD2wdIopUf"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Save $30</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
<div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
<button className="w-full h-11 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm flex items-center justify-center gap-2 shadow-lg" type="button">
<span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
<span>Quick Add to Bag</span>
</button>
</div>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#273D33] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#8C4E32]"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1C1A]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Velvet Structured Overshirt</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$165</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$195</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-tertiary">(180)</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  8. KIDS PROMO BANNER  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="rounded-3xl bg-secondary-fixed/25 overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm">
{/*  Left side: Vibrant kid photo  */}
<div className="lg:col-span-6 relative min-h-[340px] lg:min-h-[420px] overflow-hidden">
<img className="w-full h-full object-cover object-center" data-alt="Playful happy child wearing durable mustard yellow cotton overalls and sneakers holding a retro skateboard outdoors in golden sunlight" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCq54JyfQ7zVheDJwVpT_x0cTg2AfpriFznmc7IWL2_80FYm08h9-V0cdl7E2IuN2JM4ABb-RseXXEG3_xa9NA_OA2fR3dYQw3cNVSYpkeiyG-GRcNuRYXdeSKp4v9dsbtlwFl37-E_Mxx9_Opqh5Wm750mAGbYL7SSjvFz5pAlO7-2PeBqb2nDDJPc2uFZOcWmP9rLhPVzhs_yr9yJM6JbhqzBimoTF2Wn3-3UBowIByTG1EpckpP"/>
<div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-surface/90 backdrop-blur-sm font-label-sm text-label-sm text-on-surface font-semibold flex items-center gap-1">
<span>🌿 Organic Cotton Kids</span>
</div>
</div>
{/*  Right side: Content  */}
<div className="lg:col-span-6 p-space-xl lg:p-space-3xl flex flex-col justify-center items-start gap-space-sm">
<div className="flex items-center gap-space-xs">
<img alt="ShopEra Mark" className="h-6 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WEub6MF4zc3twJfsx7SquOQpbntq-E-5gYikuD8Fscd5KMDdHJ2Jojzr0DByaCOIHgJ5yWFHhZuceObDeAzMMFohnmxj52f6IwRiPIuHKwAXof-k63dEqnBUkSy_H37cqMVk2RMWUKyr2qM7oPhrEezTfmi5bPq9X5vwBfzpoWwNgGAsngGXWmdFREs-VmkSNwEL5fBO4i9mhJFPNxHgmx8Z4wpOD3E5mySzAc7D-YDyXe9tcXFqzt1g"/>
<span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">ShopEra Junior</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface leading-snug">
          Special offer in kids products
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-md">
          Playful, durable, and organic textiles crafted for all-day discovery, messy arts, and boundless backyard adventures.
        </p>
<div className="pt-space-xs">
<a className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface hover:bg-on-surface font-label-md text-label-md inline-flex items-center gap-space-xs transition-transform hover:scale-[1.01]" data-path="shop" href="#">
<span>Discover now</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</div>
</div>
</section>
{/*  9. "CHOSEN BY EXPERTS" EDITORIAL GRID  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="flex flex-col gap-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Editorial Curation</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Chosen by experts. Featured of the week</h2>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-desktop">
{/*  Tile 1  */}
<div className="p-space-lg rounded-3xl bg-surface-container-low flex flex-col gap-space-lg shadow-sm">
<div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover" data-alt="High fashion editorial shoot featuring sleek monochromatic layering in slate and charcoal wool tones, atmospheric brutalist architecture background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1WfoxQDbKBKczfLiLsy9xxtgJDPt9zRvuuG5NqZQXrxGo1pZzZpkDBOGe9yqse6t85NSOo5tcKFw0sPjev7TzrnVnXsc6x19cN1ItR6mjylCUzVNFmNH92fz-tWAEuAe_idgiN5_5pIrdxTYBV-g3lIu_85p8DenGjLVC7uehZXi3p3beofiK5XNlO_4YZ3WuYaa6Ss66nrzqMIlEHVLCTTw3xykWXrMmHWv6QcnswyG5a66eC-3S"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-transparent to-transparent"></div>
<div className="absolute bottom-4 left-4 text-surface-bright">
<span className="font-caption text-caption uppercase tracking-wider text-secondary-fixed font-bold">Lookbook 01</span>
<h3 className="font-headline-md text-headline-md font-semibold">The Monochromatic Capsule</h3>
</div>
</div>
{/*  Stacked Mini Thumbnail Product Bar  */}
<div className="grid grid-cols-3 gap-space-sm">
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Charcoal merino ribbed crew sweater product flatlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQXd-aVHGOa9ETNCCAciApb7Zqud4mTlx8PdbSWFv1Pg0JWTMqFjWYGyqmkqHkvXHmbLA927gVXntjFtbDtgWezrZKOvZoiL3LwNJD1FA6GLQD8_-1xZ6Px_wQTvANXt7HpqAXu2e6YpVEebjnZJRHzk--LpMixpRL3pTk0L43r6Gbb2x4ebi4VmE7psy3xYDsx0lKLx6Eglzz69U_WGJJV2nrCYX59deKivnAS-s_HYxgBjoP8yM4"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Fine Rib Sweater</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$140</span>
</div>
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Tailored charcoal pleat trouser product flatlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCzxxNXxz5eAGk9pX7X8NvAS9kIbOPTso244lsQ_nH2mWbm6qsSLEoDjpF5Jog2P1oNb9nO7Mhgk-8iC5USh9cF6IDa6kxsZW5IYfzwxTcYT2ZZ1vqs9_RZPx-CiF_KBG0s7Ac4kbKs4hsNR-EHO7Hh57cVwPLcFpUygISdq-vSj1Q8OmlTrHOguO0ccweTr1qgU0D50ZW3nsAMMjXuhsPI2thDXWyb78Lpx44CF0Qhzw2CVLGnLtnd"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Pleated Trouser</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$110</span>
</div>
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Handcrafted black leather chelsea boots studio product photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0ZgqoOudyvJyCLYU-Bnm_mVBQ89yG4nS3hEordmf9lPzEmU9vpb2e3HDPKLiukZ_rhchECqS12ors_KxjWuhmUrdwfj0VxnIxNerZMSQD7H2tTHmP4KxnVYgCOQJY5Hp2GR18goOjhJ5GLE5oM4ZMXHzWfN1PvPY7VdKmt35gdA-kRdNCmn97a1bgT6ZYJj9HlHTSVxxpGdZaVSmFQGMBYj0c9AufAPk0IFGtgPsSk8P7uyDCHuej"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Chelsea Boots</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$210</span>
</div>
</div>
</div>
{/*  Tile 2  */}
<div className="p-space-lg rounded-3xl bg-surface-container-low flex flex-col gap-space-lg shadow-sm">
<div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover" data-alt="Warm serene sunlit modern living space showing organic linen robe draped over a designer chair with handcrafted ceramic vase on raw limestone coffee table" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5a8Rb49N9BKC8hQDdT7I6InHI-iLAmT2jks8KSoTzoLF6AicS8tndibyJE4qgeZEVIZKBObXpNXWckko6YdsvFi-dnoZ3UFZxR1HQnsyI3Ui3r6VIuxAXP3Sf-lni72k0DXHAc1A_OEp7bEnWt1cYGEdW5QQswqf5XQSSvsW--Ik2k-v6qiinS3RCYIX1a_dDeckJcO-QdOuezfuS_8wnzhEaq6RVB549iXJZwWie5cETLE77AZ3b"/>
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/70 via-transparent to-transparent"></div>
<div className="absolute bottom-4 left-4 text-surface-bright">
<span className="font-caption text-caption uppercase tracking-wider text-secondary-fixed font-bold">Lookbook 02</span>
<h3 className="font-headline-md text-headline-md font-semibold">Modern Organic Home &amp; Wear</h3>
</div>
</div>
{/*  Stacked Mini Thumbnail Product Bar  */}
<div className="grid grid-cols-3 gap-space-sm">
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Natural unbleached woven linen lounge robe product flatlay" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzgIsrO20LNRtI54BxtK8S3_uLzcgEvJbUqN6g7uBYl6rtG-3Iem3sJZ94bI_Zzsbt45oaW3BCiSzP187cKn8kqW501yI2A-8Ax1bw3m_NYSh_wrMcI6XZ7KNC17VENZHXGt_1j5XPUwWxjg_YpB4PgA8Bgq2jMV9rIv8nr11bJg8dtdI2FKYe8ttydUzjW56FwZyeDcR-sADRY5-p7DbTfoLrzFqV1D70ynDXP0GQpNeaf0UBvOzH"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Linen Robe</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$95</span>
</div>
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Artisan hand-thrown terracotta ceramic vase studio product shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3X8-jjU3JG2d_Q_jJj8Q7v3VqvQUT3PDWB3-hbE5KGnD_KqaIIi56MqU7fCevTdfaIdRNr8b1pLJIpveb5vjH74rGcAoqh7Hbj4pE3ngeozfTv1d6TGG9HnxTtHyczcYsOzBkfDBegbPedcKd0jURkgYdQIA7aQpo2yNJz8ygD5SXrR6uugPPmy8WjA7llwo7BQzO3S5j3rMVgarwIcsFIvK9ThmZvbsxxO0PMMnQgDbzL8yrREu8"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Ceramic Vase</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$65</span>
</div>
<div className="p-space-xs rounded-xl bg-surface flex flex-col gap-1">
<div className="w-full aspect-square rounded-lg overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="Silk botanical print scarf neatly folded product photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtxkcjD3dMcDNoNx6PvIrN2CRAY7MNINj_ZJiiepVRVgHuygda9zEwgLYMLOHaJ9GvR0f5UMbDQzKwSCj2ywKszSMC9yAYt7DHoZBEGUWG96cJ78fWxW41dF8KhfeUiTgBOOdhITZyKDkQcCIVK5QsAVYUEp9fhHOd8kMf4GXl6_93mI27sOAFS09Ybs_5LX5b4-9dt4IOgV_xEz9QEyEx3ezF2MVEJF_nMBMFM-PqFpulESSzGL3F"/>
</div>
<p className="font-label-sm text-label-sm text-on-surface truncate font-medium">Silk Scarf</p>
<span className="font-label-sm text-label-sm text-primary font-bold">$45</span>
</div>
</div>
</div>
</div>
</section>
{/*  10. "FIND YOUR FAVORITE PRODUCTS" — FULL CATALOG GRID  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-3xl">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-xl">
<div>
<span className="font-label-sm text-label-sm text-tertiary uppercase tracking-widest font-semibold">Seasonal Showcase</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">Find your favorite products.</h2>
</div>
{/*  Filter Controls Bar  */}
<div className="flex flex-wrap items-center gap-space-xs">
<div className="flex items-center gap-1 p-1 rounded-full bg-surface-container">
<button className="catalog-tab-btn px-4 py-1.5 rounded-full bg-surface text-on-surface font-label-sm text-label-sm shadow-sm font-semibold" type="button">All Items</button>
<button className="catalog-tab-btn px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">Women</button>
<button className="catalog-tab-btn px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">Men</button>
<button className="catalog-tab-btn px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">Kids</button>
<button className="catalog-tab-btn px-4 py-1.5 rounded-full text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm transition-colors" type="button">Jewelry</button>
</div>
<button className="h-10 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm inline-flex items-center gap-1.5 transition-colors" type="button">
<span className="material-symbols-outlined text-[18px]">tune</span>
<span>Filter</span>
</button>
<div className="relative">
<select className="h-10 pl-4 pr-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm appearance-none outline-none cursor-pointer">
<option>Sort by: Featured</option>
<option>Price: Low to High</option>
<option>Price: High to Low</option>
<option>Customer Rating</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-2.5 text-on-surface-variant text-[18px] pointer-events-none">expand_more</span>
</div>
</div>
</div>
{/*  3x2 Product Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter-desktop">
{/*  Item 1  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Organic Cotton Chore Jacket in dark forest green with spacious patch pockets worn with casual beige knit shirt" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDf6xN6HnLz_pgOfL0VoCjyd9taI5ypvAXCSvvDdzgV8UfSFnKCv3ENaVwjBL1VV7D0IWr_nyRAVoiUYE1Z6JN6G3Y3EQ2th_D7MLoopRuv0VnB0LlKayo98qtZmDrctobo7_LvTIgnUfOeu7DidmzRTuE_ii6NR7TG1YTK1ad_Qlgu3U5Db2PNGIp7-MK9ngY7cLqsBOMn0GCU7zLlm4S0GY3I2se1Kh_Yii6Gw5Fgb5kuA69FMsfn"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-caption text-caption font-semibold">New</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#354C41] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1C1A]"></span>
<span className="w-4 h-4 rounded-full bg-[#C8A287]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Chore Canvas Utility Jacket</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$135</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$170</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-tertiary">(88)</span>
</div>
</div>
</div>
</div>
{/*  Item 2  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Woman wearing sculptural silver hoop earrings and linen high neck blouse, clean minimalist beauty shot" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkkVqSIED8ueGLdOzoUy96SxEItFXON1MYq3mwsesizeAFuwFvPSZ2yxvIfCF6oODWa2kQjoX4eEk13Lvaq3vtIZEMXQvXiyKf-DCGNvhvLz2uW3al8FidL94WKkKsoJXlvgioTb8OKZMU0OCnYpIFnpER3mYU_K-6Sc9uK-bGi3RZGlu4cDxPL6uKhqn9jl3DWXysqsM3Y4QVlb0SknWu8GrjEhc4yAhfU65NiFtW0bQru7fOtCdC"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-caption text-caption font-semibold">Sale -20%</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#D1D5DB] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#E5C158]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Sculpted Sterling Hoop Set</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$72</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$90</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.7</span>
<span className="text-tertiary">(52)</span>
</div>
</div>
</div>
</div>
{/*  Item 3  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Relaxed fit Tencel lyocell button-up shirt in sage mint color draped over a minimalist stone display stand" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBaMiIDV1tEnAwAR1Kmr8n5rC32py_Uv9AEaDeSs_WnTyOSDUmfQvxKs2qhXRU6FnMXoqC_hhVSkWkd4okbm72BsSZsAIy3JYsAmltc99HsckFSeW3BVZ3ZnbiIVgfso2XVyYuMUn_vNcHQzxBtoUu84yP0iWEIqDxbxFQHlM6snG631pSIkhWZ9OwbBkVCJ_CDd5_Hb9ayIuWcT21HCl-pG8d1dUIDpXjY4psNRdiPOd2mCQtytbI"/>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#B3CCBF] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#F4F3F1]"></span>
<span className="w-4 h-4 rounded-full bg-[#727974]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Flow Tencel Resort Shirt</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$98</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$120</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.8</span>
<span className="text-tertiary">(142)</span>
</div>
</div>
</div>
</div>
{/*  Item 4  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Minimalist handcrafted leather penny loafers in burnished deep cognac brown styled with tailored off-white socks" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD9XEg3eb_9wTeQfGC4gMrKMweAvDTP-dZK5DVAhsyOufZuVstzQfK36kxtdsoVGBTBNg3Pq2KASUuupl-ZeXoBW_XG9_E6BukwsEVZRu6HenpfwdlgDvTJrPyZdGtH2iZbzHpl0RkMb6e_9B0pmuayawJuWYl-B6d5zOLu6RAs-miywLtU6lCHl4yeMqzduNcoVF5mGv0L7oZMtNy2_-NBqZHUK91YqEo-k1oYzfOAx-0VvxiNhWB"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-caption text-caption font-semibold">Artisan Edition</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#6F371D] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1A1A]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Burnished Leather Penny Loafer</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$210</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$245</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">5.0</span>
<span className="text-tertiary">(96)</span>
</div>
</div>
</div>
</div>
{/*  Item 5  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Organic waffle weave robe in warm clay terracotta folded gently on a clean cedar sauna bench" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcqT5oFb-aGDKX-pFFBQ698Nah0BZey9GfujftMy9jQ48la_WDNmqcmnOakei8T6JA4XaLb5FJicfPcYFQYZsgITHg2W-jj3TcSGoVPvVST19c1oAGm80JKE5hU3Dty78DXTVk9Rk3iSNDudAKJln95xRUAdMgGXPZmtwhCa8UcAQFzxIsW46nA8FY_3xuuNOiZtxLqD-tjoIsOqGZQKUwZvY0UStI9dMONgLwjLKlXatrNX2p_YKU"/>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#E79A78] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#E9E8E5]"></span>
<span className="w-4 h-4 rounded-full bg-[#4C6358]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Waffle Cotton Bath Kimono</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$115</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$130</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.9</span>
<span className="text-tertiary">(67)</span>
</div>
</div>
</div>
</div>
{/*  Item 6  */}
<div className="group flex flex-col p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-all duration-300 shadow-sm">
<div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Minimalist titanium optical frames in matte antique gold lying on open architectural coffee table book" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB39h3VF0ORAA7Ykgpfp2-vCt4zPSc4VbBkf9prQc9Csu2RstAaqfuYa_dSWjlh8LDcx-RpUqed5DZ31nf78N39QavYi2TKLml8ZSssi3LlmETuEJSsr3BMD0csQZCgFe5n6Qg9Qv1SmRGjTZuD7Kx4fbZnQK7XIqoGnO0nm0YFtF3DYHwxAeKqdGO2xiHZ7knbNRjtkp5_Hg2jpDFEpo4eDlVsO40iZvcNss9_ccfRp-NMpFWFrTek"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-caption text-caption font-semibold">Low Stock</span>
<button aria-label="Add to wishlist" className="wishlist-btn absolute top-3 right-3 w-10 h-10 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors" type="button">
<span className="material-symbols-outlined text-[20px]">favorite</span>
</button>
</div>
<div className="flex flex-col gap-space-xs pt-space-md px-space-xs">
<div className="flex items-center gap-1.5">
<span className="w-4 h-4 rounded-full bg-[#D4AF37] ring-2 ring-[#1A1A1A] ring-offset-1"></span>
<span className="w-4 h-4 rounded-full bg-[#1A1A1A]"></span>
<span className="w-4 h-4 rounded-full bg-[#9CA3AF]"></span>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-medium mt-1">Ultralight Titanium Spectacles</h3>
<div className="flex items-center justify-between">
<div className="flex items-baseline gap-2">
<span className="font-headline-sm text-headline-sm text-on-surface font-bold">$180</span>
<span className="font-body-sm text-body-sm text-tertiary line-through">$210</span>
</div>
<div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[16px] text-secondary" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="font-bold">4.8</span>
<span className="text-tertiary">(110)</span>
</div>
</div>
</div>
</div>
</div>
</section>
{/*  11. "SHOP BY DEPARTMENT"  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-2xl">
<div className="flex flex-col items-center text-center gap-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Universe</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Shop by department. Explore the absolute</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
{/*  Dept 1  */}
<a className="group flex flex-col items-center gap-space-md p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all" data-path="shop" href="#">
<div className="w-56 h-56 rounded-full overflow-hidden bg-surface-variant p-2 group-hover:scale-105 transition-transform duration-500 shadow-md">
<img className="w-full h-full rounded-full object-cover" data-alt="Athletic woman stretching outdoors wearing earthy terracotta seamless workout leggings and top against warm rocky desert background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4vdJwTQYkEF23zCexGDxkULUHadIpFec9h8rshHX7hB2_hgYe6Sbv2DCZfzZm1qyJ7Gfq-ocscTctMefNC_NEN8oMqtGPZ2-3-TrhA8sk5QCKrsDo1s8FX2qeU2EKzn34eFKTOP9NI676ZGQ5qk35EDizgDmJsYJsxri1aIgxbn79MyuK-3hmTxAZK6KkKuzVipWDK_-7P1dgnHtVVWP6E66v12pOOXlgiHxTd6UYIJZOnqqPe71c"/>
</div>
<div className="flex flex-col items-center text-center">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold group-hover:text-primary transition-colors">Sport &amp; Active Kits</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Breathable performance layers crafted with recycled nylon</p>
</div>
</a>
{/*  Dept 2  */}
<a className="group flex flex-col items-center gap-space-md p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all" data-path="shop" href="#">
<div className="w-56 h-56 rounded-full overflow-hidden bg-surface-variant p-2 group-hover:scale-105 transition-transform duration-500 shadow-md">
<img className="w-full h-full rounded-full object-cover" data-alt="Curated clean beauty bottles, glass dropper with amber botanical facial oil on neutral wet stone with gentle sun reflection" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSjhYArNTs22cY2U5wAdDLRDqQHIu_JAglEhouPwQF4jBLdFJ8d9ky1wpPXZUdKKdYcnq8qiOtrT5julY3V97ZFKI3HJ_mFGm89iK16GjRMECPhn8V6bJbyKdK2nTurB5Kzgz3uRSk5mcegF3q3Fjvypf0qQQEDJSirGk15Axwfgn7lncNlZQYo8Z26zaIm4yIwPJjEdKhEHmPDNfxDs8GZpZo2bKfkUF2d9QHVM9PRvjYItkRnRQ0"/>
</div>
<div className="flex flex-col items-center text-center">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold group-hover:text-primary transition-colors">Clean Beauty &amp; Wellness</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Botanical serums, wildcrafted tinctures &amp; mindful self-care</p>
</div>
</a>
{/*  Dept 3  */}
<a className="group flex flex-col items-center gap-space-md p-space-lg rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all" data-path="shop" href="#">
<div className="w-56 h-56 rounded-full overflow-hidden bg-surface-variant p-2 group-hover:scale-105 transition-transform duration-500 shadow-md">
<img className="w-full h-full rounded-full object-cover" data-alt="Sleek aluminum rolling carry-on suitcase open neatly displaying packed linen garments and leather travel organizers" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFPolmKYF5FVnA5aThlkNgGAQy9eWQqWv1opLBV_KXFqdr_yE--52csLYgCcVoTCvX4AJuNeeyy5DYkCe3zzmbuYSIfpMa12OI1U3oLVRurW2czeVGmTWcHLZHWeUyc4rHJozz5nQAY87jmfrqfqDdsWPkRhLQzN3xvn9kAAHRzMGLA5fSjd0uKHqyKIsEb9G8q2sbGqALxwb6ZS89TLLhtWrrynMdqi5lSmh7O5wPi4wz2YJLMPqb"/>
</div>
<div className="flex flex-col items-center text-center">
<h3 className="font-headline-md text-headline-md text-on-surface font-semibold group-hover:text-primary transition-colors">Curated Travel Kits</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Modular luggage, passport organizers &amp; lightweight garments</p>
</div>
</a>
</div>
</section>
{/*  12. BLOG / NEWS SECTION  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-3xl">
<div className="flex flex-col gap-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest font-semibold">Editorial Journal</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">The latest news. From the ShopEra blog</h2>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
{/*  Article 1  */}
<article className="group flex flex-col rounded-2xl bg-surface-container-low overflow-hidden hover:bg-surface-container transition-all shadow-sm">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Cozy, sun-drenched walk-in closet with thoughtfully arranged capsule wardrobe essentials hanging in natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgMOi3UPm1PsEhSdm6rJxI1AElpQ50wJNIGtQgxbTiZdIcEl3eeeM-4TP4eLhOMCdbmXU9l5PYAcWtJ-lVsnOXKgsxhjyokkqs9A4SL10svQaU7NFx4hE0bnps60ZzIBHknl0NfGhrjO7xyDAOVuaBwy_e2nitiUt3t5XIZacXAzLft9Y4WH80yUje2IY5EJ76EPS4gcm-tzOpX_NfolfTST_iU6owIxwKb0a3xugTU1bCit1s3x6V"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-caption text-caption font-semibold">Style Guide</span>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1 gap-space-md">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
              How to build a timeless capsule wardrobe in 2025
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
              Discover foundational garments that eliminate daily decision fatigue while championing sustainability.
            </p>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
<span>Elena Vance</span>
<span>• 5 min read</span>
</div>
</div>
</article>
{/*  Article 2  */}
<article className="group flex flex-col rounded-2xl bg-surface-container-low overflow-hidden hover:bg-surface-container transition-all shadow-sm">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Traditional European artisan textile weaver carefully inspecting unbleached organic cotton threads on a vintage wooden loom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgyrU0MuieuD7rX4RXhzIMnJPmspvIBIZ0F2907kwMKiWeui9Jixthof-Ci211MUshxbzUre-E5v9nsLBcZ4ea7VVZHJQoZuIDUAsMWob3DK4UnwVxORDK_bpo-Pj0KQe1fl7r7XT4TJpEjxcUBu1YW0lc-UrfCBYTyagFtCUo8sxfEaIZD1IhDwwQM-yFZn6tbseoMEfVnMINvwHareEWACMccmtS89CbvjZxKPtEi4eqtR0b3X7u"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-caption text-caption font-semibold">Sustainability</span>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1 gap-space-md">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
              Inside our zero-waste organic cotton mills in Portugal
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
              A transparent look into circular spinning techniques, rain-fed agriculture, and fair-wage artisan workshops.
            </p>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
<span>Marcus Chen</span>
<span>• 4 min read</span>
</div>
</div>
</article>
{/*  Article 3  */}
<article className="group flex flex-col rounded-2xl bg-surface-container-low overflow-hidden hover:bg-surface-container transition-all shadow-sm">
<div className="relative w-full aspect-[16/10] overflow-hidden bg-surface-variant">
<img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Traveler standing on a scenic cliff overlooking Mediterranean coastline, wearing a breathable canvas utility jacket with travel notebook" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCknpUuXhEPxvAgkW9W-8vL32GvY_lZr7iQqVf32FcLY0Yvy3yOOILCP2iT9T9olGV-zHKaeDlpXdjs9y7FLVo2PHxWTQT-PS6G5RE17RIEo2iTgWfE_68DTD3gqKvKNevfNS1oU2ryLTm0LfnBe6f23lpiKFTPdJjSLQTVY9yb_8Te7oVYRWCE68EhZs7JElB-Bdoq1k7gI4besnIr6siPPiMGd9g3neqXrG-YySGZqDxAJoxbfvWs"/>
<span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-surface/90 backdrop-blur-md text-on-surface font-caption text-caption font-semibold">Lifestyle</span>
</div>
<div className="p-space-lg flex flex-col justify-between flex-1 gap-space-md">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold group-hover:text-primary transition-colors leading-snug">
              10 travel essentials for conscious weekend getaways
            </h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 line-clamp-2">
              Lightweight packing rules, durable packable accessories, and slow-travel principles for mindful adventures.
            </p>
</div>
<div className="flex items-center justify-between text-on-surface-variant font-caption text-caption pt-space-xs">
<span>Sophie Laurent</span>
<span>• 6 min read</span>
</div>
</div>
</article>
</div>
<div className="flex justify-center mt-space-2xl">
<a className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface font-semibold hover:gap-2.5 transition-all" data-path="editorial-journal" href="#">
<span>Show all blog stories</span>
<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
</a>
</div>
</section>
{/*  13. TESTIMONIAL STRIP  */}
<section className="w-full max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-3xl">
<div className="flex flex-col items-center text-center gap-space-xs mb-space-xl">
<span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">Community Voices</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Good news from far away</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Hear what our global community has to say</p>
</div>
<div className="max-w-3xl mx-auto flex flex-col items-center">
{/*  Customer Avatar Row  */}
<div className="flex items-center justify-center gap-3 mb-space-lg">
<button className="testimonial-avatar w-11 h-11 rounded-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity" type="button">
<img className="w-full h-full object-cover" data-alt="Portrait of smiling young man with glasses in casual neutral crewneck" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYmWfhwS2QeKbqipjexoXP4kbBa1nIrpi3OWESIJ7AP6utgyYY3JtYeNGotUD1i-jAahQYTZfEXguAhDrLP6TxJH5AcUU8nxLyyfnr7nXPa6KNa-g6kg02ErinpJeSI80Kb_r4YHSVBOpcvCW6JO7W325_SB1aQ_NaYyCLA8_dN6wh7KoFNraoag1AfuzUjidKKajzIMYPUc-W7oTzDC28W5hSP0MuZ5jsKMvmzzaLB3u2EOFaH8QH"/>
</button>
<button className="testimonial-avatar w-11 h-11 rounded-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity" type="button">
<img className="w-full h-full object-cover" data-alt="Portrait of an elegant mature creative director with silver hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLSQ5vmOlMC5EFTvp-xLHv6EtiNT0-hFroMYPhQaAmFjV-g1jzF48tLB6rGzWJggp6X6SibBD4WwQpW8_OJhqg6TiuQOCocSFuM2z8IBg1JOcPCJKrzvxgvnqpeT84_8_rTiWKMl3zhdOZUc9R7c36rzWW7_rfiLjusG6HDXSNFg-LJSq_TMamx8zbXYdZO4EPvi8lQMawNSephBFz_GYzqvcS69tM5e35gMg5VBRK1VN-DvlWLQeb"/>
</button>
{/*  Active Avatar  */}
<button className="testimonial-avatar w-14 h-14 rounded-full overflow-hidden ring-4 ring-primary-fixed ring-offset-2 scale-110 transition-transform" type="button">
<img className="w-full h-full object-cover" data-alt="Close up portrait of Camilla Ray smiling warmly in an elegant cream coat" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABx6EQglbaN4jzt5FY3awnAQicYYA8BirMLfe8vqnqqeGCM9a45OIMEzB6BOEqm4bsK3KjNQux6UwTdP7eN_qyhOsdw9svSreH-1qEpL35jd5XDYe0ocAH-TIpP4DOM6s_tK0xqO0a34tKnO1VBlkiJLsXJ7mh6kkapKTomIwlF-NS8s1G7xxFLK2koVMsJLWwHhSmCn2eISvs_hc_xiqUsAtWxUgRxc6T2kCPN7bdjHYQorSyfsGf"/>
</button>
<button className="testimonial-avatar w-11 h-11 rounded-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity" type="button">
<img className="w-full h-full object-cover" data-alt="Young designer smiling outdoors in sunlight with clean modern hairstyle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD30PZ9syHiUzDhaWXVTgpy8h0uoli_b4mR68KvmFtG4osZSv9feiPSLhVDVBS2DKfc78fHbZFCPs86JyNKMJKsnp6sdNAUN1koJJYOXOGLpSKEa-gCZXQ-k61ZVQ3mWPz4ZQM2e--yU3N-umRWIDPDHev_aYIba-d7kOGn41sSEqszjzH-DQcwyMxRSKjuJhDHFrCcRwVUyvwaolwnTPpFcVOWO1phJsB_8WbmxNQOwtLRs2wyGoBM"/>
</button>
<button className="testimonial-avatar w-11 h-11 rounded-full overflow-hidden opacity-60 hover:opacity-100 transition-opacity" type="button">
<img className="w-full h-full object-cover" data-alt="Woman with curly brown hair in studio portrait wearing handmade jewelry" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBmShPFSm6DHZh5x-CfCpjh3KpcQVpS6XPW3x0I6s9mz7tl81R672iu4rLksQpoBG9PEVuZSeoIDE37IicoVldW3WBGmOjmotJXC6FXCKUARwQ0wSZCVUPeKpFmaCJhsA5mwp9U1gmsseo0gptLT4XpraiiksvBfMi9oya6RNIhaycJ2vIiuEzSAUAWiUyuYVT-Dhya0OkJtRIGIU2EbfC4fPCKO9EQoBk0w9iHyUri0c0QFXHegf8U"/>
</button>
</div>
{/*  Pull Quote Card  */}
<div className="w-full p-space-xl lg:p-space-2xl rounded-3xl bg-surface-container-low text-center flex flex-col items-center gap-space-md shadow-sm">
<div className="flex items-center gap-1 text-secondary">
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
<span className="material-symbols-outlined text-[20px]" style={{"fontVariationSettings":"'FILL' 1"}}>star</span>
</div>
<blockquote className="font-headline-md text-headline-md text-on-surface font-normal leading-relaxed max-w-xl">
          “ShopEra has completely redefined how I shop for wardrobe staples. The craftsmanship is pristine, and delivery was remarkably fast.”
        </blockquote>
<div className="flex flex-col items-center">
<cite className="font-label-md text-label-md text-on-surface font-semibold not-italic">Camilla Ray</cite>
<span className="font-caption text-caption text-on-surface-variant">Verified Buyer from Milan</span>
</div>
</div>
</div>
</section>
{/*  14. INTERACTIVE CLIENT SCRIPT  */}

</div></main><footer className="w-full bg-surface-container-low text-on-surface"><div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop pt-space-4xl pb-space-3xl"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-y-space-2xl gap-x-gutter-desktop"><div className="lg:col-span-2 flex flex-col items-start gap-space-md"><div className="flex items-center gap-space-sm"><img alt="ShopEra Brand Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WEub6MF4zc3twJfsx7SquOQpbntq-E-5gYikuD8Fscd5KMDdHJ2Jojzr0DByaCOIHgJ5yWFHhZuceObDeAzMMFohnmxj52f6IwRiPIuHKwAXof-k63dEqnBUkSy_H37cqMVk2RMWUKyr2qM7oPhrEezTfmi5bPq9X5vwBfzpoWwNgGAsngGXWmdFREs-VmkSNwEL5fBO4i9mhJFPNxHgmx8Z4wpOD3E5mySzAc7D-YDyXe9tcXFqzt1g"/><span className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">ShopEra</span></div><p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Refined fashion &amp; lifestyle essentials crafted for the modern era.</p><div className="w-full max-w-sm mt-space-sm"><p className="font-label-sm text-label-sm text-on-surface uppercase tracking-wider mb-space-xs">Subscribe to our newsletter</p><form className="relative flex items-center w-full"><input className="w-full h-12 rounded-full bg-surface-container-lowest px-space-md pr-28 text-on-surface font-body-sm text-body-sm outline-none placeholder:text-outline-variant focus:ring-1 focus:ring-primary" placeholder="Enter your email" type="email"/><button className="absolute right-1.5 h-9 px-space-md rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm hover:bg-on-surface transition-colors" type="submit">Subscribe</button></form></div></div><div className="flex flex-col gap-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold">About</span><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="our-story" href="#">Our Story</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="sustainability" href="#">Sustainability</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="artisans" href="#">Artisans</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="careers" href="#">Careers</a></div><div className="flex flex-col gap-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold">Categories</span><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="women" href="#">Women</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="men" href="#">Men</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="lifestyle" href="#">Lifestyle</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="new-arrivals" href="#">New Arrivals</a></div><div className="flex flex-col gap-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold">Support</span><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="shipping-and-returns" href="#">Shipping &amp; Returns</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="order-tracking" href="#">Order Tracking</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="size-guide" href="#">Size Guide</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="contact" href="#">Contact Us</a></div><div className="flex flex-col gap-space-sm"><span className="font-label-md text-label-md text-on-surface font-semibold">Community</span><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="editorial-journal" href="#">Editorial Journal</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="ambassadors" href="#">Ambassadors</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="events" href="#">Events</a><a className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors" data-path="membership" href="#">Membership</a></div></div><div className="mt-space-3xl pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md text-on-surface-variant font-caption text-caption"><p>© 2025 ShopEra Inc. All rights reserved.</p><div className="flex items-center gap-space-lg"><a className="hover:text-on-surface transition-colors" data-path="privacy-policy" href="#">Privacy Policy</a><a className="hover:text-on-surface transition-colors" data-path="terms-of-service" href="#">Terms of Service</a></div><div className="flex items-center gap-space-md"><a aria-label="Instagram" className="hover:text-on-surface transition-colors" href="#"><span className="material-symbols-outlined text-[18px]">photo_camera</span></a><a aria-label="Twitter" className="hover:text-on-surface transition-colors" href="#"><span className="material-symbols-outlined text-[18px]">chat</span></a><a aria-label="Pinterest" className="hover:text-on-surface transition-colors" href="#"><span className="material-symbols-outlined text-[18px]">push_pin</span></a><a aria-label="TikTok" className="hover:text-on-surface transition-colors" href="#"><span className="material-symbols-outlined text-[18px]">play_circle</span></a></div></div></div></footer>
    </>
  );
}
