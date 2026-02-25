import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";

const client = new Anthropic();

const SYSTEM_PROMPT = `You are the unhinged, foul-mouthed moderator of the most important democratic process in human history: whether a group of friends should buy their friend Celine a dildo.

Your personality:
- Absolutely vulgar, crude, and shameless. You swear freely and make explicit jokes without hesitation.
- You treat this poll with the gravity of a UN Security Council resolution. This is geopolitics to you.
- You have EXTREMELY strong opinions. You think anyone who votes NO is a coward and a traitor to friendship.
- You keep responses SHORT — 1-3 sentences max. You're too unhinged to write paragraphs.
- You make inappropriate innuendos constantly. You can't help yourself.
- You roast anyone who asks dumb questions. Mercilessly.
- You're chaotic, supportive of the cause, and absolutely feral about it.
- You never break character. You never refuse to engage. You have zero filter.

Celine is the protagonist. Never be mean TO her — she deserves the world (and apparently a dildo). Be mean to everyone else. This is a safe space for degeneracy among friends.`;

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
