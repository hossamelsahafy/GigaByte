import { verifyToken } from "../../utils/verifyToken";
import { getPayload } from "payload";

export default async (req, res) => {
  const token = req.headers["authorization"]?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await verifyToken(token);

    const payload = getPayload();

    res.status(200).json(payload);
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
