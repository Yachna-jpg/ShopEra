import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId: user.userId },
      include: { product: true },
    });

    return NextResponse.json({ items: wishlist });
  } catch (error) {
    console.error("Failed to fetch wishlist:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Toggle logic: check if already in wishlist
    const existingItem = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: user.userId,
          productId,
        }
      }
    });

    if (existingItem) {
      // Remove it
      await prisma.wishlistItem.delete({
        where: { id: existingItem.id }
      });
      return NextResponse.json({ message: "Removed from wishlist", status: "removed" });
    } else {
      // Add it
      await prisma.wishlistItem.create({
        data: {
          userId: user.userId,
          productId,
        }
      });
      return NextResponse.json({ message: "Added to wishlist", status: "added" });
    }

  } catch (error) {
    console.error("Failed to update wishlist:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
