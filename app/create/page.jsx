"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateRecipe() {
	const [recipe, setRecipe] = useState({
		name: "",
		image: "",
		ingredients: [],
		method: "",
		timePrep: "",
		timeCook: "",
		macros: {
		perServe: false,
		carbs: "",
		fat: "",
		protein: "",
		kj: ""
		}
	});

	const [ingredient, setIngredient] = useState({ name: "", measurement: "", notes: "" });

	const handleChange = (e) => {
		const { name, value } = e.target;
		setRecipe((prev) => ({ ...prev, [name]: value }));
	};

	const handleMacroChange = (e) => {
		const { name, value } = e.target;
		setRecipe((prev) => ({
		...prev,
		macros: { ...prev.macros, [name]: value }
		}));
	};

	const handleIngredientChange = (e) => {
		const { name, value } = e.target;
		setIngredient((prev) => ({ ...prev, [name]: value }));
	};

	const addIngredient = () => {
		setRecipe((prev) => ({
			...prev,
			ingredients: [...prev.ingredients, ingredient]
		}));
		setIngredient({ name: "", measurement: "", notes: "" });
	};

	const removeIngredient = (index) => {
		setRecipe((prev) => ({
			...prev,
			ingredients: prev.ingredients.filter((_, i) => i !== index)
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const response = await fetch("/api/recipes", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(recipe)
		});
		if (response.ok) {
			alert("Recipe created!");
		}
	};

	return (
		<div className="max-w-lg mx-auto p-4 bg-amber-600">
		<h1 className="text-2xl font-bold mb-4">Create Recipe</h1>
		<form onSubmit={handleSubmit} className="space-y-4">
			<input type="text" name="name" value={recipe.name} onChange={handleChange} placeholder="Recipe Name" className="w-full p-2 border rounded" required />
			<input type="text" name="image" value={recipe.image} onChange={handleChange} placeholder="Image URL" className="w-full p-2 border rounded" />
			
			<div className="space-y-2">
			<h2 className="text-lg font-semibold">Ingredients</h2>
			{recipe.ingredients.map((ing, index) => (
				<div key={index} className="flex justify-between items-center border p-2 rounded">
				<p>{ing.name} - {ing.measurement} {ing.notes && `(${ing.notes})`}</p>
				<button type="button" onClick={() => removeIngredient(index)} className="text-black">Remove</button>
				</div>
			))}
			<div className="space-y-2">
				<input type="text" name="name" value={ingredient.name} onChange={handleIngredientChange} placeholder="Ingredient Name" className="w-full p-2 border rounded" />
				<input type="text" name="measurement" value={ingredient.measurement} onChange={handleIngredientChange} placeholder="Measurement" className="w-full p-2 border rounded" />
				<input type="text" name="notes" value={ingredient.notes} onChange={handleIngredientChange} placeholder="Notes (optional)" className="w-full p-2 border rounded" />
				<button type="button" onClick={addIngredient} className="w-full btn text-white p-2 rounded">Add Ingredient</button>
			</div>
			</div>
			
			<textarea name="method" value={recipe.method} onChange={handleChange} placeholder="Method" className="w-full p-2 border rounded" required />
			<input type="number" name="timePrep" value={recipe.timePrep} onChange={handleChange} placeholder="Preparation Time (minutes)" className="w-full p-2 border rounded" required />
			<input type="number" name="timeCook" value={recipe.timeCook} onChange={handleChange} placeholder="Cooking Time (minutes)" className="w-full p-2 border rounded" required />
			
			<h2 className="text-lg font-semibold">Macros</h2>
			<input type="checkbox" name="perServe" checked={recipe.macros.perServe} onChange={(e) => setRecipe((prev) => ({ ...prev, macros: { ...prev.macros, perServe: e.target.checked } }))} /> Per Serve
			<input type="number" name="carbs" value={recipe.macros.carbs} onChange={handleMacroChange} placeholder="Carbs" className="w-full p-2 border rounded" required />
			<input type="number" name="fat" value={recipe.macros.fat} onChange={handleMacroChange} placeholder="Fat" className="w-full p-2 border rounded" required />
			<input type="number" name="protein" value={recipe.macros.protein} onChange={handleMacroChange} placeholder="Protein" className="w-full p-2 border rounded" required />
			<input type="number" name="kj" value={recipe.macros.kj} onChange={handleMacroChange} placeholder="Energy (kJ)" className="w-full p-2 border rounded" required />
			
			<button type="submit" className="w-full btn text-white p-2 rounded">Create Recipe</button>
		</form>
		</div>
	);
}