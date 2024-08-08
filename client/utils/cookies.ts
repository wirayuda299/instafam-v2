"use server";

import { getToken } from "@/actions/token";
import { cookies } from "next/headers";

export async function getCookies() {
  return await cookies().toString();
}

export async function prepareHeaders() {
  //const token = await getToken();
  return {
    "Content-type": "application/json",
    //Authorization: `Bearer - ${token}`,
    //Cookies: await getCookies(),
  };
}
