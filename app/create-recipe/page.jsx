"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRecipe() {
	const router = useRouter();
	const [recipe, setRecipe] = useState({
		name: "",
		ingredients: "",
		instructions: "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setRecipe({ ...recipe, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const response = await fetch("/api/recipes", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(recipe),
		});

		if (response.ok) {
		router.push("/");
		} else {
		alert("Failed to create recipe");
		}

		setLoading(false);
	};

	return (
		<div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
		<h2 className="text-2xl font-bold mb-4">Create Recipe</h2>
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
			type="text"
			name="name"
			value={recipe.name}
			onChange={handleChange}
			placeholder="Recipe Name"
			required
			className="input"
			/>
			<textarea
			name="ingredients"
			value={recipe.ingredients}
			onChange={handleChange}
			placeholder="Ingredients (comma separated)"
			required
			className="input"
			/>
			<textarea
			name="instructions"
			value={recipe.instructions}
			onChange={handleChange}
			placeholder="Instructions"
			required
			className="input"
			/>
			<button type="submit" className="btn" disabled={loading}>
			{loading ? "Saving..." : "Save Recipe"}
			</button>
		</form>
		</div>
	);
}