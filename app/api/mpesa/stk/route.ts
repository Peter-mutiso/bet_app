import { NextResponse } from "next/server";

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY!;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET!;
const SHORTCODE = process.env.MPESA_SHORTCODE!;
const PASSKEY = process.env.MPESA_PASSKEY!;
const CALLBACK_URL = process.env.MPESA_CALLBACK_URL!;

/**
 * Get OAuth Token
 */
async function getAccessToken() {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  const data = await res.json();
  return data.access_token;
}

/**
 * STK PUSH
 */
export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json({ error: "Invalid or missing JSON body" }, { status: 400 });
  }

  const { phone, amount } = body || {};

  if (!phone || !amount) {
    return NextResponse.json({ error: "phone and amount are required" }, { status: 400 });
  }

  let token: string;
  try {
    token = await getAccessToken();
  } catch (err: any) {
    console.error("getAccessToken failed", err);
    return NextResponse.json({ error: "Failed to obtain access token" }, { status: 502 });
  }

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);

  const password = Buffer.from(
    `${SHORTCODE}${PASSKEY}${timestamp}`
  ).toString("base64");

  const payload = {
    BusinessShortCode: SHORTCODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: "CustomerPayBillOnline",
    Amount: amount,
    PartyA: phone,
    PartyB: SHORTCODE,
    PhoneNumber: phone,
    CallBackURL: CALLBACK_URL,
    AccountReference: "TRADING_DEPOSIT",
    TransactionDesc: "Account Deposit",
  };

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  let data: any;
  try {
    // attempt to parse JSON, but gracefully fallback to text
    const txt = await res.text();
    try {
      data = txt ? JSON.parse(txt) : {};
    } catch (e) {
      data = { text: txt };
    }
  } catch (err) {
    console.error("Failed to read STK response", err);
    return NextResponse.json({ error: "Failed to read STK response" }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ error: "STK request failed", details: data }, { status: res.status });
  }

  return NextResponse.json(data);
}