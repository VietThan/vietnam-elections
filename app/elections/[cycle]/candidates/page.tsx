import CandidatesListClient from "./CandidatesListClient";
import CycleNav from "../CycleNav";

const SUPPORTED_CYCLES = ["na15-2021", "na16-2026"];

export async function generateStaticParams() {
  return SUPPORTED_CYCLES.map((cycle) => ({ cycle }));
}

export default function CandidatesListPage({
  params,
}: {
  params: { cycle: string };
}) {
  return (
    <div className="grid gap-6">
      <CycleNav cycle={params.cycle} />
      <CandidatesListClient cycle={params.cycle} />
    </div>
  );
}
