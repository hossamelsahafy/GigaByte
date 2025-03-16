// /pages/api/log-ip.js

export default function handler(req, res) {
  // Capture the IP address from the request
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  console.log("IP Address:", ip); // Log the IP address to the console

  res.status(200).json({ message: "IP logged successfully", ip: ip });
}
