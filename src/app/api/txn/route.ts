// import { env } from "@/env";
// import { NextResponse } from "next/server";

// export default async function POST(req: Request) {
//   const apiKey = req.headers.get("x-api-key");

//   if (!apiKey) {
//     return NextResponse.json({ message: "Missing API key" }, { status: 400 });
//   }
//   if (apiKey !== env.RE_UP_API) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   console.log("API key is valid");

//   const body = await req.json();

//   const { user_id, pi_id, txn_id, resource, product_type } = body;

//   const decoded = btoa(resource).toString();

//   return NextResponse.json({
//     user_id,
//     txn_id,
//     pi_id,
//     decoded: decoded,
//     message: "successful",
//     product_type,
//   });
// }
