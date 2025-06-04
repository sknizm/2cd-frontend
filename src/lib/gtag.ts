// src/lib/gtag.ts
export const GA_MEASUREMENT_ID = 'G-VP3HE0L2S5';

export const pageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export const event = (
  action: string,
  params: Record<string, unknown> = {}
) => {
  window.gtag('event', action, params);
};
