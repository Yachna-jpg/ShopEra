import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}
