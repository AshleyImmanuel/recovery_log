import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
    callbacks: {
        async signIn({ user, account }) {
            if (account.provider === "google") {
                try {
                    await prisma.user.upsert({
                        where: { email: user.email },
                        update: {
                            name: user.name,
                            image: user.image,
                        },
                        create: {
                            email: user.email,
                            name: user.name,
                            image: user.image,
                        }
                    });
                    return true;
                } catch (error) {
                    console.error("Error saving user:", error);
                    return true;
                }
            }
            return true;
        },
        async session({ session }) {
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    }
};
