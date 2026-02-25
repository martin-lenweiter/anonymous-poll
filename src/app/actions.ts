"use server";

import { kv } from "@vercel/kv";

export type PollOption = "yes" | "no";

export type PollResults = {
  yes: number;
  no: number;
  total: number;
};

export async function vote(option: PollOption): Promise<PollResults> {
  await kv.incr(`poll:${option}`);
  return getResults();
}

export async function getResults(): Promise<PollResults> {
  const [yes, no] = await kv.mget<[number, number]>(
    "poll:yes",
    "poll:no"
  );
  const y = yes ?? 0;
  const n = no ?? 0;
  return { yes: y, no: n, total: y + n };
}
