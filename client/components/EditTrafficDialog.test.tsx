import type { useUpdateTrafficRecord } from "@/hooks/useUpdateTrafficRecord";
import { useEditTrafficFormStore } from "@/stores/useEditTrafficFormStore";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import EditTrafficDialog from "./EditTraficDialog";

function mockMutationResult(
  overrides: Partial<ReturnType<typeof useUpdateTrafficRecord>> = {},
) {
  return {
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    error: null,
    ...overrides,
  } as unknown as ReturnType<typeof useUpdateTrafficRecord>;
}

describe("EditTraficDialog", () => {
  afterEach(() => {
    useEditTrafficFormStore.setState({
      isOpen: false,
      recordId: null,
      vehicleCount: 0,
    });
  });

  it("submits the new vehicle count for the record that user is updating", async () => {
    const user = userEvent.setup();
    const mutate = vi.fn();
    const mutation = mockMutationResult({ mutate });
    useEditTrafficFormStore.setState({
      isOpen: true,
      recordId: "first-record",
      vehicleCount: 42,
    });

    render(<EditTrafficDialog mutation={mutation} />);

    const input = screen.getByPlaceholderText("Enter count");
    fireEvent.change(input, { target: { value: "75" } });

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(mutate).toHaveBeenCalledTimes(1);
    expect(mutate).toHaveBeenCalledWith(
      { id: "first-record", vehicleCount: 75 },
      expect.objectContaining({ onSuccess: expect.any(Function) }),
    );
  });

  it("disables the submit button and does not call the handler when the count is deleted from the input ", async () => {
    const user = userEvent.setup();
    const mutate = vi.fn();
    const mutation = mockMutationResult({ mutate });
    useEditTrafficFormStore.setState({
      isOpen: true,
      recordId: "first-record",
      vehicleCount: 42,
    });

    render(<EditTrafficDialog mutation={mutation} />);

    const input = screen.getByPlaceholderText("Enter count");
    fireEvent.change(input, { target: { value: "" } });

    const saveButton = screen.getByRole("button", { name: /save changes/i });
    expect(saveButton).toBeDisabled();

    await user.click(saveButton);

    expect(mutate).not.toHaveBeenCalled();
  });
});
