"use client";

import { useTraficRecords } from "@/hooks/useTrafficRecords";
import type { useUpdateTrafficRecord } from "@/hooks/useUpdateTrafficRecord";
import { useEditTrafficFormStore } from "@/stores/useEditTrafficFormStore";
import { Button, Card, Table, Text } from "@radix-ui/themes";
import { Pencil } from "lucide-react";
import { TrafficTableSkeleton } from "./TrafficTableSkeleton";

type TraficTableProps = {
  mutation: ReturnType<typeof useUpdateTrafficRecord>;
};

export default function TraficTable({ mutation }: TraficTableProps) {
  const { isCurrentDataPending, data } = useTraficRecords();
  const openDialog = useEditTrafficFormStore((s) => s.openDialog);

  if (isCurrentDataPending) {
    return <TrafficTableSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <Card size="3">
        <Text size="2" color="gray">
          No records available.
        </Text>
      </Card>
    );
  }

  return (
    <Card size="3">
      <Table.Root variant="ghost">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Country</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Vehicle Type</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Count</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Timestamp</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell justify="end">Edit</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data.map((record, index) => {
            const cellStyle =
              index === data.length - 1 ? { boxShadow: "none" } : undefined;
            const isSaving =
              mutation.isPending && mutation.variables?.id === record.id;
            return (
              <Table.Row key={record.id}>
                <Table.RowHeaderCell style={cellStyle}>
                  {record.country}
                </Table.RowHeaderCell>
                <Table.Cell style={cellStyle}>{record.vehicleType}</Table.Cell>
                <Table.Cell style={cellStyle}>
                  {isSaving ? (
                    <span className="inline-block h-4 w-10 animate-pulse rounded bg-slate-200 align-middle" />
                  ) : (
                    record.count.toLocaleString()
                  )}
                </Table.Cell>
                <Table.Cell style={cellStyle}>
                  {new Date(record.timestamp).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Table.Cell>
                <Table.Cell style={cellStyle} justify="end">
                  <Button
                    size="1"
                    variant="soft"
                    onClick={() => openDialog(record)}
                    disabled={isSaving}
                  >
                    <Pencil size={13} />
                    Edit
                  </Button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
