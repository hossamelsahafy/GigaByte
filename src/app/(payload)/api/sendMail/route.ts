import { NextResponse } from "next/server.js";
import { sendMail } from "../../lib/sendEmail.js";
import type { NextRequest } from "next/server.js";

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const subject = `New Contact Form Submission from ${name}`;
    const text = `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nMessage:\n${message}`;
    const html = `<p><strong>Name:</strong> ${name}</p>
                  <p><strong>Phone:</strong> ${phone}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong> ${message}</p>`;

    await sendMail({
      email,
      sendTo: process.env.SITE_MAIL_RECIEVER,
      subject,
      text,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
