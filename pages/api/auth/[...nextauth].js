import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import { adapter } from "next/dist/server/web/adapter";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "../../../lib/db"

// const client = new MongoClient(process.env.MONGODB_URI).connect();

export const authOptions = {
	session: {
		strategy: "jwt",
	},
	adapter: MongoDBAdapter(await client),
	providers: [
		CredentialsProvider({
		name: "Credentials",
		credentials: {
			email: { label: "Email", type: "email", placeholder: "you@example.com" },
			password: { label: "Password", type: "password" },
		},
		async authorize(credentials) {
			try {
				await client;
				const usersCollection = client.db("recipes").collection("users");

				const user = await usersCollection.findOne({ email: credentials.email });
				if (!user) throw new Error("No user found with this email");
				console.log(`User is: ${JSON.stringify(user, null, 2)}`);
				const isValidPassword = await bcrypt.compare(credentials.password, user.password);
				if (!isValidPassword) throw new Error("Invalid password");

				return { id: user._id, email: user.email };
			} finally {
				await client.close();
			}
		},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
		if (user) token.id = user.id;
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id;
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/auth/signin",
	},
};

export default NextAuth(authOptions);