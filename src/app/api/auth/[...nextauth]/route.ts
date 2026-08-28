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
        email: { label: "Email", type: "email", placeholder: "admin@golfpro.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("LOGIN ATTEMPT:", credentials?.email, credentials?.password);
        console.log("NODE_ENV:", process.env.NODE_ENV);
        
        if (!credentials?.email || !credentials.password) {
          console.log("Missing credentials");
          return null;
        }

        // SECURITY: These hardcoded fallbacks are strictly for LOCAL testing 
        // due to your local network blocking MongoDB. 
        // They will NEVER be active in the production environment.
        if (process.env.NODE_ENV === 'development') {
          const email = credentials?.email?.trim();
          const pass = credentials?.password?.trim();
          console.log("Trimmed:", email, pass);
          
          if (email === 'customer@golfpro.com' && pass === 'customer123') {
            return { id: '2', name: 'Test Customer', email: 'customer@golfpro.com', role: 'user' };
          }
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) return null;

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) return null;

          return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
        } catch (error) {
          console.error("MongoDB connection failed in NextAuth. Using fallbacks only.");
          
          // Seamless mock login fallback if DB fails locally
          if (process.env.NODE_ENV === 'development' && credentials?.email) {
            return { 
              id: 'mock-user-123', 
              name: credentials.email.split('@')[0], 
              email: credentials.email, 
              role: 'user' 
            };
          }
          
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
