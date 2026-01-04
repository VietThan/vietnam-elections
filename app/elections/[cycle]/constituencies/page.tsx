import ConstituenciesClient from "./ConstituenciesClient";
import CycleNav from "../CycleNav";

const SUPPORTED_CYCLES = ["na15-2021", "na16-2026"];

export async function generateStaticParams() {
  return SUPPORTED_CYCLES.map((cycle) => ({ cycle }));
}

export default function ConstituenciesPage({
  params,
}: {
  params: { cycle: string };
}) {
  return (
    <div className="grid gap-6">
      <CycleNav cycle={params.cycle} />
      <ConstituenciesClient cycle={params.cycle} />
    </div>
  );
}
