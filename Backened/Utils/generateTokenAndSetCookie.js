import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
  const token = jwt.sign(
    { id: userId }, // ✅ MUST be `id`
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,     // localhost
    sameSite: "lax",   // cross-port
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return token;
};
