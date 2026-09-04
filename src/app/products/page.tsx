import { prisma } from "@/lib/prisma";
import ProductsCatalogClient from "./ProductsCatalogClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
  });

  return (
    <div className="bg-background min-h-screen pt-24 font-body-md antialiased text-on-surface">
      <div className="max-w-[1440px] mx-auto px-margin-mobile lg:px-margin-desktop py-space-xl">
        <div className="flex flex-col gap-space-xs mb-space-xl text-center items-center">
          <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-semibold">
            All Collections
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">
            Shop Everything
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mt-2">
            Explore our curated selection of high-quality products.
          </p>
        </div>

        <ProductsCatalogClient products={products} />
      </div>
    </div>
  );
}
