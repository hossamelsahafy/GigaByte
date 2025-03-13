import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/dbConnect";
import jwt from "jsonwebtoken";

export async function DELETE(req, { params }) {
  const { id } = params; // Extract user ID from URL

  // ✅ Get the token from headers
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET); // 🔐 Verify JWT
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const userId = decoded.id;
  const userRole = decoded.role;

  const client = await clientPromise;
  const db = client.db("GigaByte");
  const usersCollection = db.collection("users");
  const ordersCollection = db.collection("orders");

  // ✅ Ensure only the user or an admin can delete the account
  if (userRole !== "admin" && userId !== id) {
    return NextResponse.json(
      { error: "Forbidden: You can't delete this account" },
      { status: 403 }
    );
  }

  // ✅ Check if the user has active orders
  const userOrders = await ordersCollection.find({ userId: id }).toArray();
  if (userOrders.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete account with active orders" },
      { status: 400 }
    );
  }

  // ✅ Delete the user
  await usersCollection.deleteOne({ _id: id });

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
