import Link from "next/link";

const cycles = [
  { id: "na15-2021", name: "NA15 (2021)" },
  { id: "na16-2026", name: "NA16 (2026)" },
];

export default function CycleNav({ cycle }: { cycle: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 text-xs text-zinc-600">
      <div className="flex items-center gap-2">
        <Link className="text-zinc-500 hover:text-zinc-900" href="/elections">
          Elections
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="font-semibold text-zinc-900">{cycle}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {cycles.map((item) => (
          <Link
            key={item.id}
            href={`/elections/${item.id}`}
            className={`rounded-full border px-3 py-1 transition ${
              item.id === cycle
                ? "border-zinc-900 bg-zinc-900 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
