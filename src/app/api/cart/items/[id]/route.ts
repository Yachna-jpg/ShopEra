import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true, product: true },
    });

    if (!item || item.cart.userId !== user.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (quantity > item.product.stock) {
      return NextResponse.json({ error: "Not enough stock" }, { status: 400 });
    }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updatedCart || { items: [] });
  } catch (error) {
    console.error("Cart item PUT error:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const item = await prisma.cartItem.findUnique({
      where: { id },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== user.userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id } });

    const updatedCart = await prisma.cart.findUnique({
      where: { id: item.cartId },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(updatedCart || { items: [] });
  } catch (error) {
    console.error("Cart item DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
