import { describe, expect, it } from "vitest";
import { setAnalyticsAdapter, trackEvent, type AnalyticsEvent } from "../src/services/analytics";

describe("analytics boundary", () => {
  it("tracks only typed restrained events through the configured adapter", async () => {
    const events: AnalyticsEvent[] = [];
    setAnalyticsAdapter({
      async track(event) {
        events.push(event);
      }
    });

    await trackEvent({ name: "product_viewed", sku: "AG-SU-001" });

    expect(events).toEqual([{ name: "product_viewed", sku: "AG-SU-001" }]);
  });
});
