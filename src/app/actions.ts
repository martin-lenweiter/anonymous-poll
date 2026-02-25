"use server";

import { kv } from "@vercel/kv";

export type PollOption = "yes" | "no" | "maybe";

export type PollResults = {
  yes: number;
  no: number;
  maybe: number;
  total: number;
};

export async function vote(option: PollOption): Promise<PollResults> {
  await kv.incr(`poll:${option}`);
  return getResults();
}

export async function getResults(): Promise<PollResults> {
  const [yes, no, maybe] = await kv.mget<[number, number, number]>(
    "poll:yes",
    "poll:no",
    "poll:maybe"
  );
  const y = yes ?? 0;
  const n = no ?? 0;
  const m = maybe ?? 0;
  return { yes: y, no: n, maybe: m, total: y + n + m };
}
