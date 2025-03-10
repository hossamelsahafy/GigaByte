import crypto from "crypto";
import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI;
let clientPromise = null;

async function getDb() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri);
  }
  const client = await clientPromise;
  return client.db();
}

export const generatePasswordResetToken = async (email) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) return null;

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiration = new Date(Date.now() + 3600000);

  await db
    .collection("users")
    .updateOne({ email }, { $set: { resetToken, resetTokenExpiration } });

  return resetToken;
};

export const verifyPasswordResetToken = async (email, token) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({
    email,
    resetToken: token,
    resetTokenExpiration: { $gt: new Date() },
  });

  return !!user;
};

export const updatePassword = async (email, newPassword) => {
  const db = await getDb();
  const user = await db.collection("users").findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  const hashedPassword = await hash(newPassword, 10);

  await db
    .collection("users")
    .updateOne(
      { email },
      {
        $set: {
          password: hashedPassword,
          resetToken: null,
          resetTokenExpiration: null,
        },
      }
    );
};
