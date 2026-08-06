"use client";

import { useTabStore, type TrafficTab } from "@/stores/useTabStore";
import { Box, Tabs } from "@radix-ui/themes";
import TrafficByCountryPanel from "./panels/TraficByCountryPanel";
import TrafficByVehicleTypePanel from "./panels/TraficByVehicleTypePanel";

export default function TrafficPageTabs() {
  const activeTab = useTabStore((s) => s.activeTab);
  const setActiveTab = useTabStore((s) => s.setActiveTab);

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={(v) => setActiveTab(v as TrafficTab)}
    >
      <Tabs.List>
        <Tabs.Trigger value="by-country">By Country</Tabs.Trigger>
        <Tabs.Trigger value="by-vehicle-type">By Vehicle Type</Tabs.Trigger>
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="by-country">
          <TrafficByCountryPanel />
        </Tabs.Content>

        <Tabs.Content value="by-vehicle-type">
          <TrafficByVehicleTypePanel />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
