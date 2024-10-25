// utils/google-analytics.ts

import ReactGA from "react-ga4";

const initializeGA = (): void => {
  // Replace with your Measurement ID
  // It ideally comes from an environment variable
  ReactGA.initialize("G-02BJRFJYN1");
  // console.log("GA INITIALIZED");
};

const trackGAEvent = (
  category: string,
  action: string,
  label: string
): void => {
  // Send GA4 Event
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};

export default initializeGA;
export { initializeGA, trackGAEvent };
