import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI;
const options = {
  ssl: true,
  tls: true,
  tlsAllowInvalidCertificates: true, // Use with caution in production
};

let client;
let clientPromise;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.HOST === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
