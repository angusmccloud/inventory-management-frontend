export type TelemetryEvent = {
  name: string;
  properties?: Record<string, unknown>;
};

export const trackEvent = (event: TelemetryEvent): void => {
  if (process.env['NEXT_PUBLIC_GA_TRACKING_ID']) {
    // Placeholder for future analytics provider integration.
    console.info('Telemetry event', event);
    return;
  }

  if (process.env['NODE_ENV'] !== 'production') {
    console.info('Telemetry event', event);
  }
};

export default { trackEvent };
