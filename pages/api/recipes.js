import { MongoClient } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import client from "../../lib/db"

async function getRecipes(page = 1, recipesPerPage = 15) {
	console.log('DB URL: ', process.env.MONGODB_URI);
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
	try {
		const session = await getServerSession(req, res, authOptions);
		if (!session) {
			return { status: 401, message: "Unauthorized" };
		}

		await client.connect();
		const database = client.db('recipes');
		const recipesCollection = database.collection('recipes');

		const { name, image, ingredients, method, timePrep, timeCook, macros } = req.body;

		if (!name || !ingredients || !method || !timePrep || !timeCook || !macros) {
			return { status: 400, message: "Missing required fields" };
		}

		const newRecipe = {
			name,
			image,
			ingredients,
			method,
			timePrep,
			timeCook,
			macros,
			createdBy: session.user.email, // Track the user who created the recipe
			createdAt: new Date(),
		};

		const result = await recipesCollection.insertOne(newRecipe);
		return {
			status: 201,
			data: result
		};
	} catch (error) {
		console.error("Error creating recipe:", error);
		return {
			status: 500,
			message: "Internal Server Error"
		};
	} finally {
		await client.close();
	}
}

export default async function handler(req, res) {
	if (req.method === "GET") {
		const { page = 1 } = req.query;
		const recipesData = await getRecipes(Number(page));
		return res.status(200).json(recipesData);
	}

	if (req.method === "POST") {
		const result = await createRecipe(req, res);
		return res.status(result.status).json(result.data || { message: result.message });
	}

	res.status(405).json({ message: "Method Not Allowed" });
}