import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email.trim().toLowerCase() });

          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;

          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            role: user.role || 'user' 
          };
        } catch (error) {
          console.error("NextAuth Authorize error:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role || 'user';
        (session.user as any).id = token.id || token.sub;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
};

const nextAuthHandler = NextAuth(authOptions);

export async function GET(req: any, context: any) {
  try {
    let params = context?.params;
    if (params && typeof params.then === 'function') {
      params = await params;
    }
    const res = await nextAuthHandler(req, { ...context, params });
    if (res && res.status === 500) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return res;
  } catch (err: any) {
    console.error("NEXTAUTH_INTERNAL_ERROR:", err);
    return new Response(JSON.stringify({ user: null }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function POST(req: any, context: any) {
  try {
    let params = context?.params;
    if (params && typeof params.then === 'function') {
      params = await params;
    }
    const res = await nextAuthHandler(req, { ...context, params });
    if (res && res.status === 500) {
      return new Response(JSON.stringify({ error: "Auth processing error" }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    return res;
  } catch (err: any) {
    console.error("NEXTAUTH_INTERNAL_ERROR:", err);
    return new Response(JSON.stringify({ error: err?.message || "Auth error" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }
}
