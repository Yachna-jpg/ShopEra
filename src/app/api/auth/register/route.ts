import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validation/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
 
    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0]?.message || "Invalid registration data";
      return NextResponse.json(
        { error: firstIssue },
        { status: 400 }
      );
    }
 
    const { name, password } = parsed.data;
    const email = parsed.data.email.trim().toLowerCase();
 
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered. Please sign in instead." },
        { status: 400 }
      );
    }
 
    const passwordHash = await bcrypt.hash(password, 12);
 
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
    });
 
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
