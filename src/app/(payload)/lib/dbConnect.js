import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Standardize to MONGODB_URI

if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const options = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB connection failed:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB connection failed:", err);
    throw err;
  });
}

export default clientPromise;
