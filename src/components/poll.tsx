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
  const [showResults, setShowResults] = useState(false);
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
        <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <button
            onClick={() => handleVote("yes")}
            disabled={isPending}
            className="retro-btn bg-[#00ff00] text-black text-2xl font-bold px-8 py-4 w-full sm:w-auto min-w-[160px]"
          >
            ✅ YES
          </button>
          <button
            onClick={() => handleVote("no")}
            disabled={isPending}
            className="retro-btn bg-[#ff0000] text-white text-2xl font-bold px-8 py-4 w-full sm:w-auto min-w-[160px]"
          >
            ❌ NO
          </button>
        </div>
        {isPending && (
          <p className="blink text-[#00ff00] text-lg">Recording your vote...</p>
        )}
      </div>
    );
  }

  const max = Math.max(displayResults.yes, displayResults.no, 1);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className="text-2xl text-[#00ff00] font-bold">
        Thank you for voting!
      </p>

      {showImage && (
        <div className="image-reveal neon-glow rounded-lg overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images.avif"
            alt="The product"
            className="w-[60vw] max-w-[400px] float-bounce"
          />
        </div>
      )}

      {!showResults ? (
        <button
          onClick={() => setShowResults(true)}
          className="retro-btn bg-[#8b00ff] text-white text-lg font-bold px-6 py-3 mt-2"
        >
          See results
        </button>
      ) : (
        <div className="w-full max-w-md space-y-3 mt-2">
          <ResultBar label="YES" count={displayResults.yes} max={max} color="#00ff00" />
          <ResultBar label="NO" count={displayResults.no} max={max} color="#ff0000" />
          <p className="text-center text-sm text-cyan-300">
            {displayResults.total} votes
          </p>
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
