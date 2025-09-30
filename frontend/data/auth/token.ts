"server only";

import * as jose from "jose";
import { configs } from "@/lib/configs";

export type User = {
  id: number;
  name: string;
  avatar?: string;
  country?: string;
};

// create token
export async function generateToken(user: User) {
  return new jose.SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(new TextEncoder().encode(configs.SESSION_SECRET));
}

// verify token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(configs.SESSION_SECRET),
    );
    return payload;
  } catch {
    throw new Error("Invalid or expired token");
  }
}
