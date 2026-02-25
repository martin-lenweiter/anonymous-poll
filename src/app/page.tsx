import { Poll } from "@/components/poll";
import { Chat } from "@/components/chat";
import { getResults } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const results = await getResults();

  return (
    <div className="min-h-screen bg-[#000080] text-white flex flex-col items-center justify-center px-4 py-6 gap-6">
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

      <div className="w-full max-w-2xl">
        <Chat />
      </div>
    </div>
  );
}
