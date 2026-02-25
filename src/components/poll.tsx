"use client";

import { useEffect, useState, useTransition } from "react";
import { vote, getResults } from "@/app/actions";
import type { PollResults, PollOption } from "@/app/actions";

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export function Poll({ initialResults }: { initialResults: PollResults }) {
  const [results, setResults] = useState<PollResults | null>(null);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof document === "undefined") return false;
    return getCookie("voted") === "true";
  });
  const [showImage, setShowImage] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (hasVoted && !results) {
      startTransition(async () => {
        const r = await getResults();
        setResults(r);
        setTimeout(() => setShowImage(true), 300);
      });
    }
  }, [hasVoted, results]);

  function handleVote(option: PollOption) {
    startTransition(async () => {
      const r = await vote(option);
      setCookie("voted", "true", 365);
      setResults(r);
      setHasVoted(true);
      setTimeout(() => setShowImage(true), 300);
    });
  }

  const displayResults = results ?? initialResults;

  if (!hasVoted) {
    return (
      <div className="flex flex-col items-center gap-6">
        <p className="text-xl text-yellow-300" style={{ fontFamily: "Comic Sans MS, cursive" }}>
          Cast your anonymous vote below:
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => handleVote("yes")}
            disabled={isPending}
            className="retro-btn bg-[#00ff00] text-black text-2xl font-bold px-8 py-4 min-w-[160px]"
          >
            ✅ YES
          </button>
          <button
            onClick={() => handleVote("no")}
            disabled={isPending}
            className="retro-btn bg-[#ff0000] text-white text-2xl font-bold px-8 py-4 min-w-[160px]"
          >
            ❌ NO
          </button>
          <button
            onClick={() => handleVote("maybe")}
            disabled={isPending}
            className="retro-btn bg-[#ffff00] text-black text-2xl font-bold px-8 py-4 min-w-[160px]"
          >
            🤔 MAYBE
          </button>
        </div>
        {isPending && (
          <p className="blink text-[#00ff00] text-lg">Recording your vote...</p>
        )}
      </div>
    );
  }

  const max = Math.max(displayResults.yes, displayResults.no, displayResults.maybe, 1);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl">
      <p className="text-2xl text-[#00ff00] font-bold blink">
        🗳️ RESULTS ARE IN! 🗳️
      </p>

      <div className="w-full space-y-4">
        <ResultBar label="✅ YES" count={displayResults.yes} max={max} color="#00ff00" />
        <ResultBar label="❌ NO" count={displayResults.no} max={max} color="#ff0000" />
        <ResultBar label="🤔 MAYBE" count={displayResults.maybe} max={max} color="#ffff00" />
      </div>

      <p className="text-lg text-cyan-300">
        Total votes: <span className="font-bold text-white">{displayResults.total}</span>
      </p>

      {showImage && (
        <div className="mt-4 flex flex-col items-center gap-4">
          <p className="text-xl text-[#ff69b4] font-bold rainbow-text">
            🎁 THE PRODUCT IN QUESTION: 🎁
          </p>
          <div className="image-reveal neon-glow rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images.avif"
              alt="The product"
              className="max-w-[300px] w-full float-bounce"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultBar({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-lg font-bold" style={{ color }}>
          {label}
        </span>
        <span className="text-lg text-white font-bold">{count}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-sm h-8 border-2" style={{ borderColor: color }}>
        <div
          className="h-full rounded-sm result-bar-glow transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
          }}
        />
      </div>
    </div>
  );
}
