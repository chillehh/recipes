"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signIn("credentials", { email, password, callbackUrl: "/" });
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen">
			<h1 className="text-2xl font-bold">Sign In</h1>
			<form onSubmit={handleSubmit} className="flex flex-col space-y-4 mt-4">
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="border p-2 rounded"
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					className="border p-2 rounded"
				/>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded">
					Sign In
				</button>
			</form>
		</div>
	);
}