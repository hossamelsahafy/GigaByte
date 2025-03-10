import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const payload = req.payload;

    // Check if the user already exists
    const existingUser = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (existingUser.docs.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await payload.create({
      collection: "users",
      data: {
        email,
        password,
        firstName,
        lastName,
        role: "user",
      },
    });

    return res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
