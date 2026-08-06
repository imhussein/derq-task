"use client";

import { ReactFragment } from "@/helpers/ReactFragment";
import { useTraficByVehicleType } from "@/hooks/useTraficByVehicleType";
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

const COLORS = ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"];
const SKELETON_HEIGHTS = [85, 60, 95, 45, 70];

function TraficByCountryChartLines() {
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
        cursor={{ fill: "rgba(14,165,233,0.04)" }}
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

export function TraficByVehicleTypeChart() {
  const country = useTrafficFiltersStore((store) => store.country);
  const { isCurrentDataPending, data } = useTraficByVehicleType(country);

  if (isCurrentDataPending) {
    return <ChartLoadingSkeleton heights={SKELETON_HEIGHTS} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center text-sm text-slate-400">
        No traffic data by vehicle type.
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
          <TraficByCountryChartLines />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
