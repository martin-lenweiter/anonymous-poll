import { Poll } from "@/components/poll";
import { Chat } from "@/components/chat";
import { getResults } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const results = await getResults();

  return (
    <div className="min-h-screen bg-[#000080] text-white flex flex-col lg:flex-row">
      {/* Main content - centered on desktop */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6">
        <div className="text-center">
          <p className="text-lg sm:text-xl text-yellow-300 mb-2" style={{ fontFamily: "Comic Sans MS, cursive" }}>
            Someone&apos;s in need...
          </p>
          <h1
            className="rainbow-text text-3xl sm:text-4xl md:text-5xl font-bold leading-tight"
            style={{ fontFamily: "Comic Sans MS, cursive" }}
          >
            Should we buy Celine a dildo?
          </h1>
        </div>

        <div className="w-full max-w-2xl">
          <Poll initialResults={results} />
        </div>

        {/* Chat below poll on mobile only */}
        <div className="w-full max-w-2xl lg:hidden">
          <Chat />
        </div>
      </div>

      {/* Chat sidebar on desktop */}
      <div className="hidden lg:flex h-screen w-80 xl:w-96 border-l-2 border-[#00ff00]/30 bg-[#000060] p-4 sticky top-0">
        <Chat />
      </div>
    </div>
  );
}
