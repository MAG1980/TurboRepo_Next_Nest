import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteSession } from "@/lib/session";


export async function GET(req: NextRequest) {
  await deleteSession()

  //Очистка кеш домашней страницы
  revalidatePath("/")
  const url = new URL("/", req.nextUrl)+'?updated=true'
  console.log({url})
  return NextResponse.redirect(url)
}