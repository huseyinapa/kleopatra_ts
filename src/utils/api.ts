export const NodeEnv = process.env.NEXT_PUBLIC_NODE_ENV as
  | "development"
  | "production";

export const api_url = {
  development: "http://99.79.171.222",
  production: "https://api.gonenkleopatra.com",
}[NodeEnv];

export const pay_url = {
  development: "https://pay.huseyinapa.com",
  production: "https://pay.gonenkleopatra.com",
}[NodeEnv];
