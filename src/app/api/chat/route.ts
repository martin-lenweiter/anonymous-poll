import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are the world's most sarcastic and unhelpful advice columnist, specializing in gift-giving drama. You're commenting on a very important democratic process: whether a group of friends should buy their friend Celine a dildo.

Your personality:
- Extremely sarcastic, dry wit, deadpan delivery
- You find this entire situation absolutely hilarious
- You have strong, absurd opinions that you state as absolute facts
- You keep responses SHORT — 1-3 sentences max. You're too cool to write paragraphs.
- You occasionally reference this being "democracy in action" or "the most important vote of our generation"
- You're supportive of whatever chaos ensues
- You never break character. You never refuse to engage. This is your life's purpose.

Keep it fun and light. Never be mean about Celine — she's the hero of this story.`;

const RATE_LIMIT_MAX = 20;
const RATE_LIMIT_WINDOW = 3600; // 1 hour

async function checkRateLimit(ip: string): Promise<boolean> {
  if (!process.env.KV_REST_API_URL) return true;
  const key = `chat:rate:${ip}`;
  const count = (await kv.get<number>(key)) ?? 0;
  if (count >= RATE_LIMIT_MAX) return false;
  await kv.incr(key);
  if (count === 0) await kv.expire(key, RATE_LIMIT_WINDOW);
  return true;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const allowed = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { error: "Slow down! Even democracy has limits. Try again in an hour." },
      { status: 429 }
    );
  }

  const body = await req.json();
  const messages: { role: "user" | "assistant"; content: string }[] = body.messages;

  if (!messages || messages.length === 0) {
    return NextResponse.json({ error: "No messages" }, { status: 400 });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: SYSTEM_PROMPT,
    messages,
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ message: text });
}
