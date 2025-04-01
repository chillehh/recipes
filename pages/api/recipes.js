import client, { connectDB, gridfsBucket, ObjectId } from "../../lib/db";
import multer from "multer";
import streamifier from "streamifier";
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';

// Configure Multer to store files in memory (stream to GridFS)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Disable default body parsing
export const config = {
	api: {
		bodyParser: false,
	},
};

async function getRecipes(page = 1, recipesPerPage = 10) {
	try {
		await client.connect();
		const database = client.db('recipes');
		const recipesCollection = database.collection('recipes');
		
		// Calculate the skip value for pagination
		const skip = (page - 1) * recipesPerPage;

		// Count total documents to calculate the total page count
		const totalCount = await recipesCollection.countDocuments();

		// Fetch the paginated recipes
		const recipes = await recipesCollection
		.find({})
		.skip(skip)
		.limit(recipesPerPage)
		.toArray();

		// Calculate the total number of pages
		const pageCount = Math.ceil(totalCount / recipesPerPage);

		return {
		items: recipes,
		pagination: {
			page,
			pageCount
		}
		};
	} catch (error) {
		console.error('Error fetching recipes:', error);
		return { items: [], pagination: { page: 1, pageCount: 1 } };
	} finally {
		await client.close();
	}
}

async function createRecipe(req, res) {
	const session = await getServerSession(req, res, authOptions);
	if (!session) return res.status(401).json({ message: "Unauthorized" });

	return new Promise((resolve, reject) => {
		upload.single("image")(req, res, async (err) => {
			if (err) return reject(res.status(500).json({ message: "Image upload failed" }));

			try {
				const db = await connectDB();
				const recipesCollection = db.collection("recipes");

				const { name, ingredients, method, timePrep, timeCook, macros } = req.body;
				if (!name || !ingredients || !method || !timePrep || !timeCook || !macros) {
					return res.status(400).json({ message: "Missing required fields" });
				}

				let imageId = null;
				if (req.file) {
					const uploadStream = gridfsBucket.openUploadStream(req.file.originalname, {
					contentType: req.file.mimetype,
					});
					streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
					await new Promise((resolve, reject) => {
					uploadStream.on("finish", () => {
						imageId = uploadStream.id;
						resolve();
					});
					uploadStream.on("error", reject);
					});
				}

				const newRecipe = {
					name,
					imageId: imageId ? imageId.toString() : null,
					ingredients: JSON.parse(ingredients),
					method,
					timePrep,
					timeCook,
					macros: JSON.parse(macros),
					createdBy: session.user.email,
					createdAt: new Date(),
				};

				await recipesCollection.insertOne(newRecipe);
				resolve(res.status(201).json({ message: "Recipe created", recipe: newRecipe }));
			} catch (error) {
				console.error("Error creating recipe:", error);
				reject(res.status(500).json({ message: "Internal Server Error" }));
			}
		});
	});
}

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { page = 1 } = req.query;
		const recipesData = await getRecipes(Number(page));
		return res.status(200).json(recipesData);
	}

	if (req.method === "POST") {
		return await createRecipe(req, res);
	}

	res.status(405).json({ message: "Method Not Allowed" });
}