"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import ProductCardClient from "../ProductCardClient";
import LuxurySkeleton from "@/components/LuxurySkeleton";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category: { id: string; name: string };
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { addToCart, updateItem, getItemInCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("Organic Sage");
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "sustainability">("details");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type?: string }>({
    visible: false,
    message: "",
  });

  const inCartItem = product ? getItemInCart(product.id) : null;
  const cartQty = inCartItem ? inCartItem.quantity : 0;

  const showToast = (msg: string, type = "success") => {
    setToast({ visible: true, message: msg, type });
    setTimeout(() => setToast({ visible: false, message: "", type: "success" }), 4500);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    apiFetch(`/api/products/${id}`)
      .then((data) => {
        setProduct(data);
        setError("");
        // Fetch related products for recommendations section
        return apiFetch("/api/products");
      })
      .then((allProducts: Product[]) => {
        if (Array.isArray(allProducts)) {
          const filtered = allProducts.filter((p) => p.id !== id).slice(0, 4);
          setRelatedProducts(filtered);
        }
      })
      .catch((e) => {
        console.error("Product fetch error:", e);
        setError(e.message || "Product not found.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      showToast("Please log in to add items to your bag", "login");
      return;
    }
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      await addToCart(product.id, 1);
      showToast(`Added "${product.name}" to your bag!`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to add item to bag", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleIncrement = async () => {
    if (!inCartItem || isUpdating || !product) return;
    setIsUpdating(true);
    try {
      await updateItem(inCartItem.id, cartQty + 1);
      showToast(`Updated "${product.name}" quantity to ${cartQty + 1}`, "success");
    } catch (e: any) {
      showToast(e.message || "Failed to update quantity", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (!inCartItem || isUpdating || !product) return;
    setIsUpdating(true);
    try {
      await updateItem(inCartItem.id, cartQty - 1);
      if (cartQty - 1 === 0) {
        showToast(`Removed "${product.name}" from bag`, "info");
      } else {
        showToast(`Updated "${product.name}" quantity to ${cartQty - 1}`, "success");
      }
    } catch (e: any) {
      showToast(e.message || "Failed to update quantity", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    if (cartQty === 0) {
      await handleAddToCart();
    }
    router.push("/checkout");
  };

  const handleWishlist = async () => {
    if (!user) {
      showToast("Please log in to manage your wishlist", "login");
      return;
    }
    if (!product) return;
    try {
      const res = await apiFetch("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
      });
      showToast(res.message || "Saved to wishlist!", "info");
    } catch (e: any) {
      showToast(e.message || "Failed to update wishlist", "error");
    }
  };

  if (loading) {
    return <LuxurySkeleton type="product" />;
  }

  if (error || !product) {
    return (
      <div className="bg-background min-h-screen pt-28 pb-20 px-margin-mobile lg:px-margin-desktop antialiased">
        <div className="max-w-2xl mx-auto p-space-2xl bg-surface-container-low rounded-[2.5rem] border border-outline-variant/30 text-center flex flex-col items-center gap-space-md shadow-sm">
          <div className="w-20 h-20 rounded-full bg-secondary-fixed/30 flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[40px]">manage_search</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">
              Product Not Found
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2 max-w-md">
              The product link (<code className="px-2 py-0.5 rounded bg-surface-container-high font-mono text-xs">{id}</code>) may be expired or unavailable in our catalog.
            </p>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Link
              href="/products"
              className="h-12 px-space-xl rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-all flex items-center gap-2"
            >
              <span>Explore Full Catalog</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
            <Link
              href="/"
              className="h-12 px-space-lg rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-colors flex items-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Toast Feedback Notification Card */}
      {toast.visible && (
        <div className="fixed bottom-6 right-6 z-[150] px-5 py-4 bg-inverse-surface text-inverse-on-surface rounded-2xl shadow-2xl animate-in fade-in flex items-center gap-4 border border-outline-variant/30 max-w-md">
          <span className={`material-symbols-outlined text-[24px] ${toast.type === "login" ? "text-tertiary" : "text-secondary"}`}>
            {toast.type === "login" ? "account_circle" : "check_circle"}
          </span>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-label-md font-bold truncate">{toast.message}</span>
            <span className="font-caption text-caption text-inverse-on-surface/80">Real-time cart state updated</span>
          </div>
          {toast.type === "login" ? (
            <button
              onClick={() => router.push(`/login?callbackUrl=/products/${product.id}`)}
              className="px-3.5 py-1.5 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:bg-secondary/90 transition-colors whitespace-nowrap"
            >
              Sign In
            </button>
          ) : (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                onClick={() => router.push("/cart")}
                className="px-3 py-1 rounded-full bg-surface/20 text-inverse-on-surface hover:bg-surface/30 font-label-sm text-label-sm font-semibold transition-colors whitespace-nowrap"
              >
                View Bag
              </button>
              <button
                onClick={() => router.push("/checkout")}
                className="px-3.5 py-1 rounded-full bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold hover:bg-secondary/90 transition-colors whitespace-nowrap"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      )}

      <div className="bg-background min-h-screen pt-24 pb-20 font-body-md text-on-surface antialiased">
        <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop">
          {/* Breadcrumb Navigation Trail */}
          <nav className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant mb-space-lg">
            <Link href="/" className="hover:text-on-surface transition-colors">
              Home
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/products" className="hover:text-on-surface transition-colors">
              Shop Catalog
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-secondary font-bold truncate max-w-[180px]">
              {product.category?.name || "Collection"}
            </span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Main Product Showcase Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-desktop items-start">
            {/* Left Column: Image Gallery & Badges */}
            <div className="lg:col-span-6 flex flex-col gap-space-md">
              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-surface-container-high shadow-sm group">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-surface-container-highest">
                    <span className="material-symbols-outlined text-[48px] opacity-40">image</span>
                    <span className="font-label-md text-label-md mt-2">No Image Preview</span>
                  </div>
                )}

                {/* Floating Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  <span className="px-4 py-2 rounded-full bg-surface/90 backdrop-blur-md font-label-sm text-label-sm text-on-surface font-bold shadow-sm uppercase tracking-wider">
                    {product.category?.name || "Premium Craft"}
                  </span>
                  {product.stock > 0 ? (
                    <span className="px-4 py-1.5 rounded-full bg-secondary-fixed/90 backdrop-blur-md font-caption text-caption text-on-secondary-fixed font-bold shadow-sm flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-secondary"></span>
                      In Stock ({product.stock} units)
                    </span>
                  ) : (
                    <span className="px-4 py-1.5 rounded-full bg-error-container text-error font-caption text-caption font-bold shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                <button
                  onClick={handleWishlist}
                  aria-label="Wishlist"
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-surface/85 backdrop-blur-md flex items-center justify-center text-on-surface hover:text-secondary transition-colors shadow-md"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[24px]">favorite</span>
                </button>
              </div>

              {/* Trust Badges Strip */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center">
                <div className="flex flex-col items-center gap-1 p-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">local_shipping</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">Free Express</span>
                  <span className="font-caption text-caption text-on-surface-variant">Orders over $50</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2 border-x border-outline-variant/20">
                  <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">100% Authentic</span>
                  <span className="font-caption text-caption text-on-surface-variant">Guaranteed craft</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-2">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">published_with_changes</span>
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">30-Day Returns</span>
                  <span className="font-caption text-caption text-on-surface-variant">Hassle-free exchange</span>
                </div>
              </div>
            </div>

            {/* Right Column: Product Info & Purchase Controls */}
            <div className="lg:col-span-6 flex flex-col gap-space-lg">
              <div className="bg-surface-container-low p-space-xl lg:p-space-2xl rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col gap-space-md">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                    {product.category?.name || "ShopEra Collection"}
                  </span>
                  <h1 className="font-display-lg text-headline-lg lg:text-display-lg text-on-surface font-bold tracking-tight mt-1">
                    {product.name}
                  </h1>

                  {/* Rating & Review Counter */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-secondary">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-label-md text-label-md text-on-surface font-bold">4.9</span>
                    </div>
                    <span className="text-outline text-xs">•</span>
                    <span className="font-caption text-caption text-on-surface-variant">
                      128 Verified Customer Reviews
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-3 pt-2 border-t border-outline-variant/20">
                  <span className="font-display-md text-display-md text-on-surface font-bold">
                    ${(product.price / 100).toFixed(2)}
                  </span>
                  <span className="font-label-sm text-label-sm text-secondary font-semibold uppercase tracking-wider">
                    Complimentary Express Shipping Included
                  </span>
                </div>

                {/* Description */}
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  {product.description ||
                    "Artisan lifestyle goods crafted with understated Scandinavian elegance and sustainable materials for daily life."}
                </p>

                {/* Color Swatch Selection */}
                <div className="flex flex-col gap-2 pt-2">
                  <label className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                    Selected Color: <span className="text-secondary font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex items-center gap-3">
                    {["Organic Sage", "Sand Charcoal", "Warm Terracotta"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`h-10 px-4 rounded-full font-label-sm text-label-sm transition-all flex items-center gap-2 border ${
                          selectedColor === color
                            ? "bg-surface-container-high border-primary text-on-surface font-bold shadow-sm"
                            : "bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-outline"
                        }`}
                        type="button"
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${
                            color === "Organic Sage"
                              ? "bg-[#273D33]"
                              : color === "Sand Charcoal"
                              ? "bg-[#33312E]"
                              : "bg-[#8A5A44]"
                          }`}
                        ></span>
                        <span>{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface font-bold uppercase tracking-wider">
                    Size / Variant
                  </label>
                  <div className="flex items-center gap-2">
                    {["Small", "Medium", "Large", "Custom Fit"].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 px-4 rounded-2xl font-label-sm text-label-sm transition-all border ${
                          selectedSize === size
                            ? "bg-inverse-surface text-inverse-on-surface font-bold border-inverse-surface shadow-sm"
                            : "bg-surface-container-lowest border-outline-variant/40 text-on-surface-variant hover:border-outline"
                        }`}
                        type="button"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reactive Cart Quantity Controller & CTAs */}
                <div className="flex flex-col gap-3 pt-4 border-t border-outline-variant/30">
                  {cartQty > 0 ? (
                    <div className="w-full p-4 rounded-2xl bg-secondary-fixed/20 border border-secondary-fixed/40 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary text-[24px]">shopping_bag</span>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface font-bold">
                            {cartQty} {cartQty === 1 ? "item" : "items"} currently in your bag
                          </p>
                          <p className="font-caption text-caption text-on-surface-variant">
                            Subtotal: ${((product.price * cartQty) / 100).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-surface-container-high p-1.5 rounded-full border border-outline-variant/40">
                        <button
                          onClick={handleDecrement}
                          disabled={isUpdating}
                          className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-50"
                          title="Decrease"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-6 text-center font-bold text-sm">{cartQty}</span>
                        <button
                          onClick={handleIncrement}
                          disabled={isUpdating || product.stock <= cartQty}
                          className="w-8 h-8 rounded-full bg-surface flex items-center justify-center text-on-surface hover:bg-surface-container-lowest transition-colors disabled:opacity-50"
                          title="Increase"
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>
                  ) : null}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-1">
                    <button
                      onClick={handleAddToCart}
                      disabled={product.stock === 0 || isUpdating}
                      className="h-14 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-bold hover:bg-on-surface transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
                      <span>{product.stock === 0 ? "Out of Stock" : isUpdating ? "Adding..." : "Add to Shopping Bag"}</span>
                    </button>

                    <button
                      onClick={handleBuyNow}
                      disabled={product.stock === 0}
                      className="h-14 rounded-full bg-secondary text-on-secondary font-label-md text-label-md font-bold hover:bg-secondary/90 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">bolt</span>
                      <span>Buy Now &amp; Checkout</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Accordion / Specification Tabs */}
              <div className="bg-surface-container-low p-space-xl rounded-[2.5rem] border border-outline-variant/30 shadow-sm flex flex-col gap-space-md">
                <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3">
                  {(["details", "shipping", "sustainability"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-full font-label-sm text-label-sm font-bold capitalize transition-colors ${
                        activeTab === tab
                          ? "bg-primary-fixed/40 text-primary border border-primary/30"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                      type="button"
                    >
                      {tab === "details" ? "Craft & Details" : tab === "shipping" ? "Shipping & Guarantee" : "Sustainability"}
                    </button>
                  ))}
                </div>

                <div className="text-body-sm font-body-sm text-on-surface-variant leading-relaxed">
                  {activeTab === "details" && (
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Organic natural fibers with reinforced seam construction</li>
                      <li>Ergonomic design tailored for long-term comfort</li>
                      <li>Designed in Stockholm, responsibly manufactured</li>
                      <li>Includes original ShopEra authenticity certificate</li>
                    </ul>
                  )}
                  {activeTab === "shipping" && (
                    <ul className="space-y-2 list-disc list-inside">
                      <li>Complimentary express 2-3 business day courier delivery</li>
                      <li>Tracked dispatch with SMS &amp; email delivery updates</li>
                      <li>30 days complimentary exchange or full refund policy</li>
                    </ul>
                  )}
                  {activeTab === "sustainability" && (
                    <ul className="space-y-2 list-disc list-inside">
                      <li>GOTS Certified Organic Material</li>
                      <li>Zero plastic biodegradable shipping packaging</li>
                      <li>Climate neutral carbon offset logistics</li>
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Showcase Grid */}
          {relatedProducts.length > 0 && (
            <div className="mt-space-3xl flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
                    Complete The Look
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                    You May Also Like
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="font-label-md text-label-md text-primary font-bold hover:underline flex items-center gap-1"
                >
                  <span>View All Products</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter-desktop">
                {relatedProducts.map((relProd) => (
                  <ProductCardClient key={relProd.id} product={relProd} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
