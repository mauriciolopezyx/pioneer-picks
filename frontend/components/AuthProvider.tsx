import React, { createContext, useContext } from "react";
import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

type User = {
    username: string,
    email: string,
    role: string
} | null | undefined

type AuthContext = {
  user: User,
  loading: boolean,
  refetch: () => void
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const { isLoading:loading, data:user, refetch } = useQuery({
        queryKey: ["authenticated-heartbeat"],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            console.log("Session id is:", sessionId)
            const response = await fetch(`http://${LOCALHOST}:8080/user`, {
                method: "GET",
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            const json = await response.json()
            return json
        },
        refetchOnWindowFocus: true,
    })

    console.log(loading, user)

    return (
        <AuthContext.Provider value={{ user, loading, refetch }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};