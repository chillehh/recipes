"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
	const router = useRouter();
	const { data: session } = useSession();

	return session ? (
		<button onClick={() => signOut()} className="btn">
		Sign out ({session.user.email})
		</button>
	) : (
		<button onClick={() => router.push("/auth/signin")} className="btn">
		Sign in
		</button>
	);
}