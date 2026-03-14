export interface AnalyticsEvent {
  readonly name: string;
  readonly userId?: string;
  readonly properties?: Record<string, unknown>;
  readonly timestamp: string;
}

export interface AnalyticsClient {
  track: (event: AnalyticsEvent) => void;
}

export const createConsoleAnalyticsClient = (): AnalyticsClient => {
  return {
    track: (event: AnalyticsEvent) => {
      // Keeping side effects minimal and observable
      // eslint-disable-next-line no-console
      console.log("[analytics]", JSON.stringify(event));
    }
  };
};
