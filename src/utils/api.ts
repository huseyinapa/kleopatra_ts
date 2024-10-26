export const api_url =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? "http://3.124.99.216"
    : "https://www.gonenkleopatra.com";

export const pay_url =
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? "https://pay.huseyinapa.com"
    : "https://pay.gonenkleopatra.com";
