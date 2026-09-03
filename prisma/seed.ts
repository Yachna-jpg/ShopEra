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
