import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.DATABASE_URL);

async function getRecipes(page = 1, recipesPerPage = 15) {
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

export default async (req, res) => {
  const { page = 1 } = req.query; // Get the page from query params (defaults to 1)

  const recipesData = await getRecipes(Number(page));

  res.status(200).json(recipesData);
};