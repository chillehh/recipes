"use client";

import { useState } from "react";
import RecipeModal from "./recipe-modal"; // The modal component

export default function RecipeCard({ recipe }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Clickable Card */}
            <div 
                className="cursor-pointer bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-lg transition-shadow duration-200"
                onClick={() => setIsOpen(true)}
            >
                {/* Image (Fallback if empty) */}
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {recipe.imageId ? (
                        <img src={`/api/image/${recipe.imageId}`} alt={recipe.name} />
                    ) : (
                        <span className="text-gray-500">No Image Available</span>
                    )}
                </div>

                {/* Recipe Name */}
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-gray-800">{recipe.name}</h2>
                </div>
            </div>

            {/* Modal (Only Opens When Clicked) */}
            {isOpen && <RecipeModal recipe={recipe} onClose={() => setIsOpen(false)} />}
        </>
    );
}
