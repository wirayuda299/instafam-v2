"use server";

import { auth } from "@clerk/nextjs/server";

export async function getToken() {
  const { getToken, sessionId } = auth();
  if (!sessionId) {
    throw new Error("Unauthorized");
  }

  const token = await getToken();
  return token;
}
