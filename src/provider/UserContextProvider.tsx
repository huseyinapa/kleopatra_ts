"use client"; // Client Component olduğunu belirtir

import { CookieUser } from "@/types/cookie";
import React, { createContext, useContext } from "react";

// type User = { sub: number; email: string; permission: string } | null;

type UserContextProviderProps = {
  user: CookieUser;
  children: React.ReactNode;
};
const UserContext = createContext<CookieUser>(null);

export function useUser() {
  return useContext(UserContext);
}

export default function UserContextProvider({
  user,
  children,
}: UserContextProviderProps) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
// jotai
