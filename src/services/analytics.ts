export type AnalyticsEvent =
  | { name: "catalogue_viewed"; productCount: number }
  | { name: "product_viewed"; sku: string }
  | { name: "wardrobe_saved"; sku: string }
  | { name: "checkout_confirmed"; orderId: string; totalUsd: number }
  | { name: "atelier_request_created"; requestId: string };

export type AnalyticsAdapter = {
  track(event: AnalyticsEvent): Promise<void>;
};

const quietAdapter: AnalyticsAdapter = {
  async track() {
    return undefined;
  }
};

let adapter = quietAdapter;

export function setAnalyticsAdapter(nextAdapter: AnalyticsAdapter) {
  adapter = nextAdapter;
}

export async function trackEvent(event: AnalyticsEvent) {
  await adapter.track(event);
}
