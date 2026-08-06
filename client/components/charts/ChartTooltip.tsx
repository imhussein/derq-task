"use client";

interface ChartTooltipPayload {
  payload: { group: string; count: number };
  value: number;
}

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
};

export function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const { group, count } = payload[0].payload;

  const strValue = count.toLocaleString();

  return (
    <div className="rounded-lg border border-slate-200  bg-white/95 px-3 py-2 shadow-lg ">
      <p className="text-xs font-medium text-slate-400">{group}</p>
      <p className="text-sm font-bold text-slate-900">{strValue} vehicles</p>
    </div>
  );
}
