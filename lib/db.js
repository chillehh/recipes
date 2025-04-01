// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { MongoClient, ServerApiVersion, GridFSBucket, ObjectId } from "mongodb"

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
};

let client = new MongoClient(uri, options);
let gridfsBucket;

async function connectDB() {
	if (!client.topology || !client.topology.isConnected()) {
		await client.connect();
	}

	const db = client.db("recipes");

	// Initialize GridFS only once
	if (!gridfsBucket) {
		gridfsBucket = new GridFSBucket(db, { bucketName: "uploads" });
	}

	return db;
}
// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export { client, connectDB, gridfsBucket, ObjectId };
export default client