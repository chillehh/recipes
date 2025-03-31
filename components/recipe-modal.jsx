"use client";

import { FaTimes } from "react-icons/fa";

export default function RecipeModal({ recipe, onClose }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-orange-500 bg-opacity-5">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                {/* Close Button */}
                <button className="absolute top-3 right-3 text-gray-600 hover:text-black" onClick={onClose}>
                    <FaTimes size={18} />
                </button>

                {/* Recipe Name */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">{recipe.name}</h2>

                {/* Image */}
                {recipe.image && (
                    <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover rounded-md mb-4" />
                )}

                {/* Ingredients */}
                <h3 className="font-semibold text-gray-700">Ingredients:</h3>
                <ul className="list-disc list-inside mb-4 text-gray-600">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient.name} - {ingredient.measurement}</li>
                    ))}
                </ul>

                {/* Method */}
                <h3 className="font-semibold text-gray-700">Method:</h3>
                <p className="text-gray-600 whitespace-pre-line mb-4">{recipe.method}</p>

                {/* Macros Data */}
                {recipe.macros && (
                    <div className="bg-gray-100 p-4 rounded-md">
                        <h3 className="font-semibold text-gray-700 mb-2">Macros</h3>
                        <p className="text-sm text-gray-600">{recipe.macros.perServe ? "Per Serving" : "Per Recipe"}</p>
                        <ul className="text-gray-700">
                            <li><strong>Carbs:</strong> {recipe.macros.carbs}g</li>
                            <li><strong>Fat:</strong> {recipe.macros.fat}g</li>
                            <li><strong>Protein:</strong> {recipe.macros.protein}g</li>
                            <li><strong>Energy:</strong> {recipe.macros.kj} kJ</li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
