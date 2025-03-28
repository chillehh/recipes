"use client";

import { useRouter } from "next/navigation";

export default function CreateRecipeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/create-recipe")}
      className="btn"
    >
      Create Recipe
    </button>
  );
}