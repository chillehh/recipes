import mongoose from "mongoose";

const Image = mongoose.Schema(
	{
		id: Number,
		img: {
			data: Buffer,
			contentType: String,
		},
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Image || mongoose.model("Image", Image);