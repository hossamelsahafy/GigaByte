import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const uri = process.env.MONGODB_URI;
let clientPromise = null;

async function getDb() {
  if (!clientPromise) {
    clientPromise = MongoClient.connect(uri);
  }
  const client = await clientPromise;
  return client.db();
}

export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: `Method ${req.method} Not Allowed` },
      { status: 405 }
    );
  }

  try {
    const body = await req.json();
    console.log(body);

    const { name, phone, address, email, cartItems, totalPrice } = body;
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token required" });
    }

    const token = authHeader.split(" ")[1];

    let userId;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.id;
    } catch (error) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const db = await getDb();

    const orderToken = jwt.sign(
      { name, phone, userId, email, address, cartItems, totalPrice },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const order = await db.collection("orders").insertOne({
      user: userId,
      products: cartItems.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      })),
      totalAmount: totalPrice,
      status: "pending_confirmation",
      verificationToken: orderToken,
      createdAt: new Date(),
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_SERVER_USERNAME,
        pass: process.env.SMTP_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_SERVER_USERNAME,
      to: email,
      bcc: process.env.TO,
      subject: "Order Details",
      html: `
        <div style="
          background-color: ${process.env.EMAIL_BG_COLOR || "#0b0c10"};
          color: ${process.env.EMAIL_TEXT_COLOR || "#c5c6c7"};
          padding: 2rem;
          font-family: Arial, sans-serif;
        ">
          <h2 style="color: #ffcc29;">Order Received</h2>
          <p>Thank you for your order. Here are the details:</p>
          
          <div style="
            background-color: #1f2833;
            padding: 1.5rem;
            border-radius: 4px;
            margin: 1rem 0;
          ">
            <p><strong style="color: #ffcc29;">Name:</strong> ${name}</p>
            <p><strong style="color: #ffcc29;">Phone:</strong> ${phone}</p>
            <p><strong style="color: #ffcc29;">Email:</strong> ${email}</p>
            <p><strong style="color: #ffcc29;">Address:</strong> ${address}</p>
          </div>
    
          <h3 style="color: #ffcc29; margin-bottom: 1rem;">Order Summary:</h3>
          <ul style="list-style: none; padding-left: 0;">
            ${cartItems
              .map(
                (item) => `
              <li style="padding: 0.5rem 0; border-bottom: 1px solid #2c353f;">
                ${item.name} - 
                <span style="color: #ffcc29;">$${item.price.toFixed(2)}</span> x 
                <span style="color: #ffcc29;">${item.quantity}</span>
              </li>
            `
              )
              .join("")}
          </ul>
    
          <p style="
            margin-top: 1.5rem;
            font-size: 1.2rem;
            color: #ffcc29;
            padding-top: 1rem;
            border-top: 2px solid #2c353f;
          ">
            Total Price: <strong>$${totalPrice.toFixed(2)}</strong>
          </p>
        </div>
      `,
      text: `Order Details\n\n
        Customer Information:
        Name: ${name}
        Phone: ${phone}
        Email: ${email}
        Address: ${address}\n\n
        Order Items:\n${cartItems
          .map(
            (item) =>
              `- ${item.name} - EGP${item.price.toFixed(2)} x ${item.quantity}`
          )
          .join("\n")}\n\n
        Total Price: EGP ${totalPrice.toFixed(2)}
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message: "Order placed! Please check your email to confirm.",
        orderId: order.insertedId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Failed to place order." },
      { status: 500 }
    );
  }
}
