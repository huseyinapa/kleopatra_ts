declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NODE_ENV: "development" | "production";
      JWT_SECRET: string;
    }
  }
}

export {};
