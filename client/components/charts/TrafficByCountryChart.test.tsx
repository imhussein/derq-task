import { useTrafficByCountry } from "@/hooks/useTrafficByCountry";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TrafficByCountryChart } from "./TrafficByCountryChart";

vi.mock("@/hooks/useTrafficByCountry", () => ({
  useTrafficByCountry: vi.fn(),
}));

const mockUseTraficByCountry = vi.mocked(useTrafficByCountry);

class MockResizeObserver implements ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

function mockChartDimensions() {
  vi.stubGlobal("ResizeObserver", MockResizeObserver);

  vi.spyOn(HTMLDivElement.prototype, "getBoundingClientRect").mockReturnValue({
    width: 600,
    height: 300,
    top: 0,
    left: 0,
    right: 600,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

describe("TrafficByCountryChart", () => {
  beforeEach(() => {
    mockChartDimensions();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("shows a loadings state while trafic data is being fetched", () => {
    mockUseTraficByCountry.mockReturnValue({
      isCurrentDataPending: true,
      data: undefined,
    });

    render(<TrafficByCountryChart />);

    expect(
      screen.getByRole("status", { name: /loading chart data/i }),
    ).toBeInTheDocument();
  });

  it("shows the trafic data for each country", () => {
    const trafficData = [
      { group: "UAE", count: 1200 },
      { group: "Saudi Arabia", count: 980 },
      { group: "Egypt", count: 430 },
    ];

    mockUseTraficByCountry.mockReturnValue({
      isCurrentDataPending: false,
      data: trafficData,
    });

    render(<TrafficByCountryChart />);

    expect(
      screen.queryByRole("status", { name: /loading chart data/i }),
    ).not.toBeInTheDocument();

    trafficData.forEach(({ group }) => {
      expect(screen.getByText(group)).toBeInTheDocument();
    });
  });

  it("shows an empty states when no traffic data is availbale", () => {
    mockUseTraficByCountry.mockReturnValue({
      isCurrentDataPending: false,
      data: [],
    });

    render(<TrafficByCountryChart />);

    expect(screen.getByText(/no traffic data by country/i)).toBeInTheDocument();
  });
});
