"use client";

import { useTrafficFiltersStore } from "@/stores/useTrafficFiltersStore";
import { Card, Flex, Select, Text } from "@radix-ui/themes";
import { TrafficByCountryChart } from "../charts/TrafficByCountryChart";

const VEHICLE_TYPES = ["Car", "Truck", "Bus", "Motorcycle", "Van"];

export default function TraficByCountryPanel() {
  const vehicleType = useTrafficFiltersStore((s) => s.vehicleType);
  const setVehicleType = useTrafficFiltersStore((s) => s.setVehicleType);

  return (
    <Card size="3">
      <Flex align="center" justify="between" mb="4" gap="3" wrap="wrap">
        <Text size="3" weight="bold">
          Vehicle count by country
        </Text>
        <Select.Root
          value={vehicleType ?? "all"}
          onValueChange={(v) => setVehicleType(v === "all" ? undefined : v)}
        >
          <Select.Trigger placeholder="All vehicle types" />
          <Select.Content>
            <Select.Item value="all">All vehicle types</Select.Item>
            {VEHICLE_TYPES.map((vt) => (
              <Select.Item key={vt} value={vt}>
                {vt}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
      <TrafficByCountryChart />
    </Card>
  );
}
