import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET || "shopera-secret-key-production-32-chars-long-secure",
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy_client_secret",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const cleanEmail = credentials.email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
          where: { email: cleanEmail },
        });
        
        if (!user || !user.passwordHash) return null;
        
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        
        if (!isValid) return null;
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).address = token.address;
        (session.user as any).phone = token.phone;
        (session.user as any).streetAddress = token.streetAddress;
        (session.user as any).apartment = token.apartment;
        (session.user as any).city = token.city;
        (session.user as any).state = token.state;
        (session.user as any).postalCode = token.postalCode;
        (session.user as any).country = token.country;
        (session.user as any).latitude = token.latitude;
        (session.user as any).longitude = token.longitude;
        (session.user as any).image = token.image;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CUSTOMER";
        token.address = (user as any).address || null;
        token.phone = (user as any).phone || null;
        token.streetAddress = (user as any).streetAddress || null;
        token.apartment = (user as any).apartment || null;
        token.city = (user as any).city || null;
        token.state = (user as any).state || null;
        token.postalCode = (user as any).postalCode || null;
        token.country = (user as any).country || "India";
        token.latitude = (user as any).latitude || null;
        token.longitude = (user as any).longitude || null;
        token.image = (user as any).image || (user as any).avatarUrl || null;
      }
      // If we update the profile via the UI and want to refresh the session:
      if (trigger === "update" && session) {
        if (session.address !== undefined) token.address = session.address;
        if (session.phone !== undefined) token.phone = session.phone;
        if (session.streetAddress !== undefined) token.streetAddress = session.streetAddress;
        if (session.apartment !== undefined) token.apartment = session.apartment;
        if (session.city !== undefined) token.city = session.city;
        if (session.state !== undefined) token.state = session.state;
        if (session.postalCode !== undefined) token.postalCode = session.postalCode;
        if (session.country !== undefined) token.country = session.country;
        if (session.latitude !== undefined) token.latitude = session.latitude;
        if (session.longitude !== undefined) token.longitude = session.longitude;
        if (session.name) token.name = session.name;
      }
      return token;
    },
  },
};

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) return null;
  return { 
    userId: (session.user as any).id as string, 
    role: (session.user as any).role as string 
  };
}
