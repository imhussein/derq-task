"use client";

import { ReactFragment } from "@/helpers/ReactFragment";
import { useTrafficByCountry } from "@/hooks/useTrafficByCountry";
import { useTrafficFiltersStore } from "@/stores/useTrafficFiltersStore";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type BarShapeProps,
} from "recharts";
import { ChartLoadingSkeleton } from "./ChartSkeleton";
import { ChartTooltip } from "./ChartTooltip";

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#1d4ed8", "#1e40af"];

function TraficBarLines() {
  return (
    <ReactFragment>
      <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
      <XAxis
        dataKey="group"
        tick={{ fontSize: 12, fill: "#94a3b8", fontWeight: 500 }}
        tickLine={false}
        axisLine={false}
        dy={8}
      />
      <YAxis
        tick={{ fontSize: 12, fill: "#94a3b8" }}
        tickLine={false}
        axisLine={false}
        width={56}
      />
      <Tooltip
        content={<ChartTooltip />}
        cursor={{ fill: "rgba(59,130,246,0.04) " }}
      />
      <Bar
        dataKey="count"
        maxBarSize={64}
        shape={(props: BarShapeProps) => (
          <Rectangle
            {...props}
            radius={[8, 8, 0, 0]}
            fill={COLORS[props.index % COLORS.length]}
          />
        )}
      />
    </ReactFragment>
  );
}

export function TrafficByCountryChart() {
  const vehicleType = useTrafficFiltersStore((store) => store.vehicleType);
  const { isCurrentDataPending, data } = useTrafficByCountry(vehicleType);

  if (isCurrentDataPending) {
    return <ChartLoadingSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-400">
        No traffic data by country.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 8, bottom: 8, left: -8 }}
        >
          <TraficBarLines />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
