"use client";

<<<<<<< Updated upstream
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
=======
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
>>>>>>> Stashed changes
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

const COLORS = [
  { name: "Oatmeal Camel", hex: "#D6CEBF" },
  { name: "Sage", hex: "#8DA399" },
  { name: "Charcoal", hex: "#3A3C3E" },
];

const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { addToCart, updateItem, getItemInCart } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
<<<<<<< Updated upstream
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
=======
  
  const { addToCart: addToCartContext } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [addedConfirm, setAddedConfirm] = useState(false);

  const [selectedColor, setSelectedColor] = useState(COLORS[0].hex);
  const [selectedSize, setSelectedSize] = useState("M");
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
  const handleAddToCart = async () => {
    if (!product) return;
    if (!user) {
      showToast("Please log in to add items to your bag", "login");
      return;
=======
  async function addToCart() {
    if (!product || isAdding) return;

    setIsAdding(true);
    try {
      await addToCartContext(product.id);
      setAddedConfirm(true);
      setTimeout(() => setAddedConfirm(false), 3000);
    } catch (e: any) {
      alert(e.message || 'Failed to add to bag');
    } finally {
      setIsAdding(false);
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 0.98, duration: 0.1 });
  };
  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" });
  };

  if (loading) return <div className="min-h-screen bg-[#F7F5F0]"><LoadingSpinner text="Loading product..." /></div>;
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 min-h-screen bg-[#F7F5F0]">
        <p className="text-red-600">{error || "Product not found"}</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
>>>>>>> Stashed changes
      </div>
    );
  }

<<<<<<< Updated upstream
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
=======
  // Derived mock data for beautiful UI representation
  const originalPrice = product.price + 2000; // Mock original price 20$ higher
  const thumbnails = [
    product.imageUrl || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#1A1A1A] font-sans selection:bg-[#E8C2B3] selection:text-[#7A4027] pb-24">
      {/* Top Main Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left: Image Gallery (55%) */}
          <div className="lg:w-[55%] flex gap-4 md:gap-6 h-[600px] md:h-[800px]">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-4 w-20 shrink-0">
              {thumbnails.map((img, i) => (
                <div key={i} className={`w-20 h-24 rounded-lg overflow-hidden border ${i === 0 ? 'border-gray-800' : 'border-transparent'} opacity-${i === 0 ? '100' : '60'} hover:opacity-100 transition-opacity cursor-pointer`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="mt-4 text-[10px] uppercase tracking-widest text-center text-gray-400 font-medium">
                100% Raw<br/>Mongolian<br/>Cashmere
              </div>
            </div>
            {/* Main Image */}
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#ebe8e0]">
              <img src={thumbnails[0]} alt={product.name} className="w-full h-full object-cover" />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[11px] uppercase tracking-[0.08em] font-medium text-gray-800 shadow-sm">
                Maison Capsule • No. 04
              </div>
              <button className="absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </button>
            </div>
          </div>

          {/* Right: Product Info (45%) */}
          <div className="lg:w-[45%] flex flex-col pt-4 md:pt-10">
            {/* Eyebrow & Title */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] uppercase tracking-[0.08em] text-gray-500 font-medium">Limited Release • Autumn / Winter</span>
              <div className="flex items-center gap-1 bg-[#F0EBE1] px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px] text-[#D4A373]">star</span>
                <span className="text-[11px] font-medium text-gray-700">4.9 (128 reviews)</span>
              </div>
            </div>
            <h1 className="text-[32px] md:text-[36px] font-medium leading-tight text-[#1A1A1A] mb-6 tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[24px] font-bold text-[#1A1A1A]">${(product.price / 100).toFixed(2)}</span>
              <span className="text-[16px] text-gray-400 line-through">${(originalPrice / 100).toFixed(2)}</span>
              <span className="bg-[#E8C2B3] text-[#7A4027] text-[12px] font-bold px-2 py-1 rounded">Save 20%</span>
            </div>

            {/* Description */}
            <p className="text-[15px] leading-[1.6] text-[#4A4A4A] mb-8 pr-4">
              {product.description || "Spun from Grade-A Inner-Mongolian raw cashmere with structured raglan sleeves, storm flap accents, and double-breasted horn closures. Designed to drape effortlessly through transitions."}
            </p>

            {/* Color Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-[#1A1A1A]">Color: <span className="text-gray-500 font-normal">{COLORS.find(c => c.hex === selectedColor)?.name}</span></span>
                <span className="text-[11px] text-gray-400">Natural Plant-Dye Wash</span>
              </div>
              <div className="flex gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selectedColor === c.hex ? 'ring-1 ring-offset-2 ring-[#1A1A1A]' : 'ring-1 ring-gray-200'}`}
                  >
                    <span className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: c.hex }}></span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-medium text-[#1A1A1A]">Size: <span className="text-gray-500 font-normal">{selectedSize} (US 4-6)</span></span>
                <button className="text-[12px] text-gray-500 hover:text-black underline underline-offset-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">straighten</span> Size Guide
                </button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`h-[44px] flex items-center justify-center rounded-lg text-[13px] font-medium transition-colors ${
                      selectedSize === s 
                        ? 'bg-[#1A1A1A] text-white' 
                        : 'bg-white border border-gray-200 text-[#1A1A1A] hover:border-gray-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Notice */}
            <div className="bg-[#F0EBE1] rounded-lg p-3 flex items-center gap-2 mb-8 border border-[#E3DCCF]">
              <div className="w-2 h-2 rounded-full bg-[#8A5A44]"></div>
              <span className="text-[13px] text-gray-700">In stock — <span className="font-semibold text-[#8A5A44]">Only {product.stock} remaining</span> in size {selectedSize}</span>
            </div>

            {/* CTA */}
            <button
              onClick={addToCart}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              disabled={isAdding || product.stock === 0}
              className="w-full h-[52px] bg-[#1A1A1A] text-white rounded-[8px] font-medium text-[15px] flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed mb-6"
            >
              {isAdding ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : addedConfirm ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  Added to Bag — ${(product.price / 100).toFixed(2)}
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                  Add to Bag — ${(product.price / 100).toFixed(2)}
                </>
              )}
            </button>

            {/* Micro Info Strip */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200 mt-auto">
              <div className="flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-gray-500">local_shipping</span>
                <span className="text-[11px] font-medium text-gray-800">Free Express</span>
                <span className="text-[10px] text-gray-500">2-3 Business Days</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-gray-500">keyboard_return</span>
                <span className="text-[11px] font-medium text-gray-800">30-Day Returns</span>
                <span className="text-[10px] text-gray-500">Complimentary Label</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-gray-500">eco</span>
                <span className="text-[11px] font-medium text-gray-800">Sustainable Cert</span>
                <span className="text-[10px] text-gray-500">Organic Cashmere</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Craft & Origin Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="flex flex-col md:flex-row gap-6 h-auto md:h-[380px]">
          {/* Main info card */}
          <div className="md:w-[65%] bg-[#F0EBE1] rounded-2xl p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#8A5A44] font-bold mb-4 block">Craft & Origin</span>
              <h2 className="text-[24px] md:text-[28px] font-medium text-[#1A1A1A] leading-tight mb-6 max-w-xl">
                Spun from renewable Mongolian underfleece, combed by hand at seasonal shedding.
              </h2>
              <p className="text-[15px] text-[#4A4A4A] leading-relaxed max-w-2xl">
                Each trench requires 32 hours of single-needle hand tailoring in our ethical atelier. Double-faced weaving creates structured drape without synthetic interfacings, allowing the coat to insulate naturally against seasonal chill.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-[#E3DCCF]">
              <div>
                <p className="text-[20px] font-bold text-[#1A1A1A]">480 g/m²</p>
                <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Fabric Weight</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-[#1A1A1A]">15.5 μm</p>
                <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Fiber Fineness</p>
              </div>
              <div>
                <p className="text-[20px] font-bold text-[#1A1A1A]">Zero</p>
                <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">Synthetic Additives</p>
              </div>
            </div>
          </div>
          {/* Certification Card */}
          <div className="md:w-[35%] bg-[#E2EBE5] rounded-2xl p-8 md:p-12 flex flex-col">
            <span className="material-symbols-outlined text-[32px] text-[#4A6353] mb-6">verified_user</span>
            <h3 className="text-[20px] font-medium text-[#1A1A1A] leading-tight mb-4">Ethical Cashmere Standard certified</h3>
            <p className="text-[14px] text-[#4A6353] leading-relaxed mb-auto">
              Traceable to nomadic herder cooperatives committed to regenerative grazing and grassland preservation in the Alashan plateau.
            </p>
            <div className="mt-8 pt-6 border-t border-[#C8D6CD]">
              <p className="text-[11px] font-bold text-[#4A6353] tracking-wide">Certificate ID: GOTS-EC-89104 • Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look Section */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-20 border-t border-gray-200">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] text-[#8A5A44] font-bold mb-2 block">Curated Ensemble</span>
            <h2 className="text-[28px] md:text-[32px] font-medium text-[#1A1A1A]">Complete the Look</h2>
          </div>
          <p className="text-[14px] text-gray-500 max-w-xs mt-4 md:mt-0 text-right hidden md:block">
            Harmonized silhouettes selected by our editorial team to complement the warm oatmeal drape of the coat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Raw Silk Ribbed Turtleneck",
              color: "Alabaster Cream",
              price: 240,
              label: "Base Layer",
              image: thumbnails[0]
            },
            {
              name: "Pleated Wide-Leg Trousers",
              color: "Muted Sage Twill",
              price: 320,
              label: "Bottom",
              image: thumbnails[0]
            },
            {
              name: "Sculpted Saddle Bag",
              color: "Calfskin in Espresso Brown",
              price: 510,
              label: "Accessory",
              image: "" // Placeholder box
            }
          ].map((item, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="relative aspect-[3/4] bg-[#F0EBE1] rounded-xl overflow-hidden mb-4 border border-transparent group-hover:border-gray-300 transition-colors">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#8A5A44]/40">
                    <span className="material-symbols-outlined text-[48px] mb-4">shopping_bag</span>
                    <span className="text-[14px] font-medium">{item.name}</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-medium text-gray-800">
                  {item.label}
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[14px] font-medium text-[#1A1A1A]">{item.name}</h4>
                  <p className="text-[12px] text-gray-500 mt-1">{item.color}</p>
                </div>
                <span className="text-[14px] font-medium text-[#1A1A1A]">${item.price}</span>
              </div>
              <button className="mt-4 w-full h-[40px] bg-[#E8E6E1] text-[#1A1A1A] hover:bg-gray-300 transition-colors rounded-lg text-[13px] font-medium">
                Quick Add - Size M
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
>>>>>>> Stashed changes
  );
}
