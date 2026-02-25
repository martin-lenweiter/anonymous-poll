import { Poll } from "@/components/poll";
import { getResults } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const results = await getResults();

  return (
    <div className="min-h-screen bg-[#000080] text-white flex flex-col items-center justify-center px-4 py-12">
      <h1
        className="rainbow-text text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-center"
        style={{ fontFamily: "Comic Sans MS, cursive" }}
      >
        Should we buy Celine a dildo?
      </h1>

      <div className="mt-8 w-full max-w-2xl">
        <Poll initialResults={results} />
      </div>
    </div>
  );
}
