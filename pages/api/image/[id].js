import { connectDB, gridfsBucket, ObjectId } from "../../../lib/db";

export default async function handler(req, res) {
	if (req.method !== "GET") {
		return res.status(405).json({ message: "Method Not Allowed" });
	}

	const { id } = req.query;
	if (!id) {
		return res.status(400).json({ message: "Missing image ID" });
	}

	try {
		const db = await connectDB();
		const objectId = new ObjectId(id);
		const downloadStream = gridfsBucket.openDownloadStream(objectId);

		res.setHeader("Content-Type", "image/jpeg"); // Set correct MIME type
		downloadStream.pipe(res);
	} catch (error) {
		console.error("Error fetching image:", error);
		res.status(500).json({ message: "Error retrieving image" });
	}
}