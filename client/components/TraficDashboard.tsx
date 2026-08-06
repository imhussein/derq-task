"use client";

import { useUpdateTrafficRecord } from "@/hooks/useUpdateTrafficRecord";
import { Flex } from "@radix-ui/themes";
import EditTrafficDialog from "./EditTraficDialog";
import TrafficTable from "./TrafficTable";
import TrafficTabs from "./TrafficTabs";

export default function TraficMainDashboard() {
  const mutation = useUpdateTrafficRecord();

  return (
    <Flex
      direction="column"
      gap="6"
      className="mx-auto w-full max-w-5xl px-6 py-10"
    >
      <TrafficTabs />
      <TrafficTable mutation={mutation} />
      <EditTrafficDialog mutation={mutation} />
    </Flex>
  );
}
