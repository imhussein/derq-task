"use client";

import { useTrafficFiltersStore } from "@/stores/useTrafficFiltersStore";
import { Card, Flex, Select, Text } from "@radix-ui/themes";
import { TraficByVehicleTypeChart } from "../charts/TrafficByVehicleTypeChart";

const COUNTRIES = ["UAE", "Saudi Arabia", "Egypt", "Qatar", "Kuwait"];

export default function TrafficByVehicleTypePanel() {
  const country = useTrafficFiltersStore((s) => s.country);
  const setCountry = useTrafficFiltersStore((s) => s.setCountry);

  return (
    <Card size="3">
      <Flex align="center" justify="between" mb="4" gap="3" wrap="wrap">
        <Text size="3" weight="bold">
          Vehicle count by type
        </Text>
        <Select.Root
          value={country ?? "all"}
          onValueChange={(v) => setCountry(v === "all" ? undefined : v)}
        >
          <Select.Trigger placeholder="All countries" />
          <Select.Content>
            <Select.Item value="all">All countries</Select.Item>
            {COUNTRIES.map((c) => (
              <Select.Item key={c} value={c}>
                {c}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
      <TraficByVehicleTypeChart />
    </Card>
  );
}
