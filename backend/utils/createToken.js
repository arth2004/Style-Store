import jwt from "jsonwebtoken";

export const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true, // Always true in cross-origin use cases
    sameSite: "None", // Required for cross-site cookies (Vercel → Render)
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return token;
};
