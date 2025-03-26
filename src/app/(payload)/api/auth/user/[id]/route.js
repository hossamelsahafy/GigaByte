import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/dbConnect";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

export async function DELETE(req, { params }) {
  const { id } = params;

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
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const userId = decoded.id;

  const client = await clientPromise;
  const db = client.db("GigaByte");
  const usersCollection = db.collection("users");
  const ordersCollection = db.collection("orders");

  if (userId !== id) {
    return NextResponse.json(
      { error: "Forbidden: You can't delete this account" },
      { status: 403 }
    );
  }

  const userOrders = await ordersCollection.find({ userId: id }).toArray();
  if (userOrders.length > 0) {
    return NextResponse.json(
      { error: "Cannot delete account with active orders" },
      { status: 400 }
    );
  }

  await usersCollection.deleteOne({ _id: id });

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}

export async function PUT(req, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const userId = decoded.id;
  const userRole = decoded.role;

  if (userRole !== "admin" && userId !== id) {
    return NextResponse.json(
      { error: "Forbidden: You can't update this account" },
      { status: 403 }
    );
  }

  const client = await clientPromise;
  const db = client.db("GigaByte");
  const usersCollection = db.collection("users");

  try {
    const body = await req.json();
    const { firstName, lastName, phoneNumber, password } = body;

    // ✅ Allow empty phone number (only validate if it's provided)
    const isValidPhoneNumber = (phoneNumber) =>
      !phoneNumber || /^\+20(10|11|12|15)[0-9]{8}$/.test(phoneNumber);

    // ✅ Only validate password if it's provided
    const isStrongPassword = (password) =>
      !password ||
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );

    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Example: +201xxxxxxxxx" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }
    if (phoneNumber) {
      const existingUser = await usersCollection.findOne({
        phoneNumber: phoneNumber.toString(), // Ensure it's a string
        _id: { $ne: new ObjectId(id) }, // Ensure _id is excluded properly
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Phone number is already in use" },
          { status: 400 }
        );
      }
    }

    let updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid user ID format" },
        { status: 400 }
      );
    }

    const user = await usersCollection.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

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
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 403 }
    );
  }

  const userId = decoded.id;
  if (userId !== id && decoded.role !== "admin") {
    return NextResponse.json(
      { error: "Forbidden: You can't access this user's data" },
      { status: 403 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("GigaByte");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
