import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        streetAddress: true,
        apartment: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        latitude: true,
        longitude: true,
        address: true,
        image: true,
        role: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { 
      name, 
      phone, 
      streetAddress, 
      apartment, 
      city, 
      state, 
      postalCode, 
      country = "India", 
      latitude,
      longitude,
      address: rawAddress 
    } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Format full address string if parts provided
    let formattedAddress = rawAddress || "";
    if (streetAddress || city || state || postalCode) {
      const parts = [
        streetAddress,
        apartment ? `Apt/Suite: ${apartment}` : null,
        city,
        state && postalCode ? `${state} - ${postalCode}` : (state || postalCode),
        country || "India"
      ].filter(Boolean);
      formattedAddress = parts.join(", ");
    }

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: { 
        name: name.trim(), 
        phone: phone ? phone.trim() : null,
        streetAddress: streetAddress ? streetAddress.trim() : null,
        apartment: apartment ? apartment.trim() : null,
        city: city ? city.trim() : null,
        state: state ? state.trim() : null,
        postalCode: postalCode ? postalCode.trim() : null,
        country: country ? country.trim() : "India",
        latitude: typeof latitude === "number" ? latitude : null,
        longitude: typeof longitude === "number" ? longitude : null,
        address: formattedAddress || null,
      },
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
