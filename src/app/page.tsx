import { Poll } from "@/components/poll";
import { getResults } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const results = await getResults();

  return (
    <div className="min-h-screen bg-[#000080] text-white flex flex-col items-center pb-12">
      {/* Marquee Banner */}
      <div className="w-full bg-[#ff00ff] text-yellow-300 text-xl font-bold py-2 overflow-hidden">
        <div className="marquee">
          <span>
            ⭐ WELCOME TO THE MOST IMPORTANT POLL ON THE INTERNET ⭐ &nbsp;&nbsp;&nbsp;
            🔥 VOTE NOW! 🔥 &nbsp;&nbsp;&nbsp;
            ⭐ WELCOME TO THE MOST IMPORTANT POLL ON THE INTERNET ⭐ &nbsp;&nbsp;&nbsp;
            🔥 VOTE NOW! 🔥 &nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* Under Construction */}
      <p className="blink text-[#ff0] text-lg mt-4 font-bold">
        🚧 UNDER CONSTRUCTION 🚧
      </p>

      {/* Title */}
      <div className="mt-6 px-4 text-center">
        <h1
          className="rainbow-text text-4xl md:text-5xl font-bold leading-tight"
          style={{ fontFamily: "Comic Sans MS, cursive" }}
        >
          Should we buy Celine a dildo?
        </h1>
      </div>

      {/* HR */}
      <hr className="w-3/4 my-6 border-[#00ff00]" />

      {/* Poll */}
      <main className="w-full max-w-2xl px-4">
        <Poll initialResults={results} />
      </main>

      {/* Visitor Counter */}
      <div className="mt-10 neon-glow p-4 bg-black/50 rounded text-center">
        <p className="text-sm text-gray-400">You are visitor number:</p>
        <p
          className="text-3xl font-bold text-[#00ff00]"
          style={{ fontFamily: "monospace" }}
        >
          {String(results.total + 1337).padStart(6, "0")}
        </p>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-xs text-gray-500 space-y-1">
        <p>Best viewed with Netscape Navigator 4.0 at 800x600</p>
        <p>© 1997 The Internet&apos;s Finest Polls™</p>
        <p className="text-[10px]">
          Made with 💖 and questionable judgment
        </p>
      </footer>
    </div>
  );
}
