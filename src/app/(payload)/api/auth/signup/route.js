import { hash } from "bcryptjs";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

const uri = process.env.DATABASE_URI;
let clientPromise = null;

async function getDb() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri);
  }
  const client = await clientPromise;
  return client.db();
}

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhoneNumber = (phone) => /^\+20(10|11|12|15)[0-9]{8}$/.test(phone);
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );
};

export async function POST(req) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phoneNumber, password } = body;

    if (!firstName || !lastName || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { message: "Invalid phone number format. Example: +201xxxxxxxxx" },
        { status: 400 }
      );
    }

    if (!isStrongPassword(password)) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();

    const existingUser = await db.collection("users").findOne({
      $or: [{ email }, { phoneNumber }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email or phone number already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    await db.collection("users").insertOne({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      role: "user",
      provider: "local",
      isVerified: false,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
