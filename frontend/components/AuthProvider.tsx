import React, { createContext, useContext, useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

// type User = {
//   username: string,
//   email: string,
//   role: string
// } | null
type User = {
    authenticated: boolean
} | null | undefined
type AuthContext = {
  user: User;
  loading: boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const { isLoading:loading, data:user } = useQuery({
        queryKey: ["authenticated-heartbeat"],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/user/ok`, {
                method: "GET",
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            return {authenticated: true}
        },
        refetchOnWindowFocus: true,
    })

    console.log(loading, user)

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};