export const NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";

export const api_url = {
  development: "http://3.124.99.216",
  production: "https://api.gonenkleopatra.com",
}[NODE_ENV];

export const pay_url = {
  development: "https://pay.huseyinapa.com",
  production: "https://pay.gonenkleopatra.com",
}[NODE_ENV];
