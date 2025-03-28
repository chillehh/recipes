import mongoose from "mongoose";

const IngredientSchema = new mongoose.Schema({
	name: { type: String, required: true },
	measurement: { type: String, required: true },
	notes: { type: String }
});

const MacrosSchema = new mongoose.Schema({
	perServe: { type: Boolean, required: true },
	carbs: { type: Number, required: true },
	fat: { type: Number, required: true },
	protein: { type: Number, required: true },
	kj: { type: Number, required: true }
});

const RecipeSchema = mongoose.Schema({
	name: { type: String, required: true },
	image: { type: mongoose.Schema.Types.ObjectId, ref: 'fs.files' }, // GridFS reference
	ingredients: [IngredientSchema],
	method: { type: String, required: true },
	timePrep: { type: Number, required: true },
	timeCook: { type: Number, required: true },
	macros: MacrosSchema
});

export default mongoose.models.RecipeSchema || mongoose.model("RecipeSchema", RecipeSchema);