import { Card, Table } from "@radix-ui/themes";

const SKELETON_ROWS = 6;

export function TrafficTableSkeleton() {
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
          {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <div className="h-4 w-24  animate-pulse rounded bg-slate-200" />
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-20  animate-pulse rounded bg-slate-200 " />
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-14  animate-pulse rounded bg-slate-200" />
              </Table.Cell>
              <Table.Cell>
                <div className="h-4 w-24  animate-pulse rounded  bg-slate-200" />
              </Table.Cell>
              <Table.Cell justify="end">
                <div className="ml-auto h-6 w-14 animate-pulse rounded bg-slate-200 " />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
}
