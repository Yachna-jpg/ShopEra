import { prisma } from "../src/lib/prisma";

async function main() {
  // Create categories
  const electronics = await prisma.category.upsert({
    where: { name: "Electronics" },
    update: {},
    create: { name: "Electronics", slug: "electronics" },
  });

  const clothing = await prisma.category.upsert({
    where: { name: "Clothing" },
    update: {},
    create: { name: "Clothing", slug: "clothing" },
  });

  const books = await prisma.category.upsert({
    where: { name: "Books" },
    update: {},
    create: { name: "Books", slug: "books" },
  });

  // Sample products (price in cents)
  const products = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Noise-cancelling over-ear headphones with 30-hour battery life.",
      price: 7999,
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      stock: 50,
      categoryId: electronics.id,
    },
    {
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Fitness tracking, heart rate monitor, and notifications.",
      price: 14999,
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
      stock: 30,
      categoryId: electronics.id,
    },
    {
      name: "Classic T-Shirt",
      slug: "classic-t-shirt",
      description: "100% cotton comfortable everyday t-shirt.",
      price: 1999,
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6854f9bf0c1?w=400",
      stock: 100,
      categoryId: clothing.id,
    },
    {
      name: "Running Shoes",
      slug: "running-shoes",
      description: "Lightweight running shoes with excellent cushioning.",
      price: 8999,
      imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
      stock: 40,
      categoryId: clothing.id,
    },
    {
      name: "The Pragmatic Programmer",
      slug: "the-pragmatic-programmer",
      description: "Classic book on software craftsmanship and best practices.",
      price: 3499,
      imageUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      stock: 25,
      categoryId: books.id,
    },
    {
      name: "Clean Code",
      slug: "clean-code",
      description: "A handbook of agile software craftsmanship by Robert C. Martin.",
      price: 2999,
      imageUrl: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400",
      stock: 20,
      categoryId: books.id,
    },
    {
      name: "Cashmere Minimalist Crewneck",
      slug: "cashmere-minimalist-crewneck",
      description: "Luxurious cashmere crewneck in oatmeal heather.",
      price: 22000,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAeNyzws5QeEe-z7PU_LMdrtQqtVJHfUB0WGTcQTGTkKRePb9aA_tHJkK1PYDOQQyijrqZyEgzRK1I9Kxnf65nc7X7SjGCTaB8YYz8IoKM6Eem2wzNDQLBKKZR1zXalD_jKalYihMLrxOCS-rJP6pG4R1Gqzvno9MnkHH1lrCctAaiZ06xWV5U06vQ1dyAlS0m3CYQKF6S2pUzd8CZbxIoIYLbIi9zX8nzPrpzJV_k1xn8f3vYWnPp3",
      stock: 50,
      categoryId: clothing.id,
    },
    {
      name: "Oversized Linen Relaxed Blazer",
      slug: "oversized-linen-relaxed-blazer",
      description: "Oversized relaxed linen blazer in raw natural flax color.",
      price: 19500,
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBx36-bjx3I_fI9saNt-4zrzPzBjDCoyHZ4yzNgPCUP3wwXw7Al-2SvAr2tgQOgs_10P8TJfJd2BztANss9IuA5JsBV8ZxKFQnjq4hrvsORf3Op3zF_-vu7BppGz8n21mUC_nbSrzp3qqcBbYWCTlgffJtJ9iFSlT6Bxz5_TkgnF_VgRhejcriXs2wJ_GCY3lXKg5EZh11R0oAxhJZ8LcYHOWJHHhC3jTS45RW1LDMtezADxoCWHsnZ",
      stock: 30,
      categoryId: clothing.id,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("Seed completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
