import mongoose from "mongoose";

const Recipe = mongoose.Schema(
  {
	title: String,
	id: Number,
	ingredients: String,
	method: String,
	macros: {
		carbs: Number,
		fat: Number,
		protein: Number,
		kj: Number
	},
	timeToPrep: Number,
	timeToCook: Number,
	image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Recipe || mongoose.model("Recipe", Recipe);