import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_payment_id, 
      razorpay_order_id, 
      shippingName,
      shippingPhone,
      shippingAddress 
    } = await req.json();

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart not found or empty" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Fetch user detailed address as fallback if not explicitly passed
    let finalAddress = shippingAddress;
    let finalPhone = shippingPhone;
    let finalName = shippingName;

    if (!finalAddress) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
      if (dbUser) {
        finalAddress = dbUser.address;
        finalPhone = finalPhone || dbUser.phone;
        finalName = finalName || dbUser.name;
      }
    }

    // Create completed Order in DB
    const order = await prisma.order.create({
      data: {
        userId: user.userId,
        totalAmount,
        status: "PAID",
        stripeSessionId: razorpay_order_id || `rzp_ord_${Date.now()}`,
        stripePaymentIntentId: razorpay_payment_id || `rzp_pay_${Date.now()}`,
        shippingName: finalName || null,
        shippingPhone: finalPhone || null,
        shippingAddress: finalAddress || null,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          })),
        },
      },
    });

    // Clear cart items
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json({ error: error.message || "Payment verification failed" }, { status: 500 });
  }
}
