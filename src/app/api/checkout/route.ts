import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TXb50snFJ94NcO";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "CePBXu7D6ffHt1X56Gmdwtks";

    try {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: totalAmount,
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
        notes: {
          userId: user.userId,
          cartId: cart.id,
        },
      });

      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: keyId,
      });
    } catch (rzpErr: any) {
      console.warn("Razorpay API create order fallback:", rzpErr?.message || rzpErr);
      return NextResponse.json({
        orderId: `order_demo_${Date.now()}`,
        amount: totalAmount,
        currency: "INR",
        key: keyId,
      });
    }
  } catch (error: any) {
    console.error("Checkout creation error:", error);
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
