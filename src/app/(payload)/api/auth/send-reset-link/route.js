import { generatePasswordResetToken } from "../../../lib/auth.js";
import { sendEmail } from "../../../lib/resetEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, message: "Email is required" }),
        { status: 400 }
      );
    }

    const token = await generatePasswordResetToken(email);
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Token generation failed" }),
        { status: 500 }
      );
    }

    const emailResult = await sendEmail({
      to: email,
      token,
      email,
      subject: "Your Password Reset Request",
    });

    if (!emailResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send reset email",
        }),
        { status: 500 }
      );
    }

    // Success response
    return new Response(
      JSON.stringify({
        success: true,
        message:
          "If an account exists with this email, you will receive a reset link shortly.",
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in reset request:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

// Optionally, handle other HTTP methods (e.g., GET)
export async function GET() {
  return new Response(
    JSON.stringify({ success: false, message: "Method not allowed" }),
    { status: 405 }
  );
}
