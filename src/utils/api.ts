export const NodeEnv = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";

export const api_url = {
  development: "http://3.124.99.216",
  production: "https://api.gonenkleopatra.com",
}[NodeEnv];

export const pay_url = {
  development: "https://pay.huseyinapa.com",
  production: "https://pay.gonenkleopatra.com",
}[NodeEnv];
