import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const data = await req.json();

  console.log("M-Pesa Callback:", JSON.stringify(data, null, 2));

  // Extract result
  const result = data.Body.stkCallback;

  if (result.ResultCode === 0) {
    const metadata = result.CallbackMetadata.Item;

    const amount = metadata.find((i: any) => i.Name === "Amount")?.Value;
    const phone = metadata.find((i: any) => i.Name === "PhoneNumber")?.Value;

    // TODO: credit user balance here
    console.log("SUCCESS:", amount, phone);
  }

  return NextResponse.json({ ok: true });
}