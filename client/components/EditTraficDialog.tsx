"use client";

import type { useUpdateTrafficRecord } from "@/hooks/useUpdateTrafficRecord";
import { useEditTrafficFormStore } from "@/stores/useEditTrafficFormStore";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";

export default function EditTraficDialog({
  mutation,
}: {
  mutation: ReturnType<typeof useUpdateTrafficRecord>;
}) {
  const isOpen = useEditTrafficFormStore((s) => s.isOpen);
  const recordId = useEditTrafficFormStore((s) => s.recordId);
  const vehicleCount = useEditTrafficFormStore((s) => s.vehicleCount);
  const setVehicleCount = useEditTrafficFormStore((s) => s.setVehicleCount);
  const closeDialog = useEditTrafficFormStore((s) => s.closeDialog);

  const isCountEmpty = vehicleCount === "";

  const handleSubmit = () => {
    if (!recordId || isCountEmpty) return;
    mutation.mutate(
      { id: recordId, vehicleCount },
      { onSuccess: () => closeDialog() },
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <Dialog.Content maxWidth="440px">
        <Dialog.Title>Edit Traffic Record</Dialog.Title>
        <Dialog.Description size="2" mb="4" color="gray">
          Update the vehicle count for this record.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="medium">
              Vehicles Count
            </Text>
            <TextField.Root
              type="number"
              value={vehicleCount}
              min={0}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const raw = e.target.value;
                setVehicleCount(raw === "" ? "" : Number(raw));
              }}
              placeholder="Enter count"
            />
          </label>

          {mutation.isError && (
            <Text size="2" color="red">
              {mutation.error?.message ?? "Failed to update record."}
            </Text>
          )}
        </Flex>

        <Flex gap="3" mt="5" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" onClick={closeDialog}>
              Cancel
            </Button>
          </Dialog.Close>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending || isCountEmpty}
          >
            {mutation.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
