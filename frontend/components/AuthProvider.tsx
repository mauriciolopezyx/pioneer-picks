import React, { createContext, useContext, useEffect } from "react";
import { useFonts } from '@expo-google-fonts/montserrat';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync()

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

    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
        Montserrat_800ExtraBold,
        Montserrat_900Black,
    });

    const { isLoading:loading, data:user, refetch } = useQuery({
        queryKey: ["authenticated-heartbeat"],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            console.log("Session id is:", sessionId)
            const response = await fetch(`${LOCALHOST}/user`, {
                method: "GET",
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            const json = await response.json()
            console.log("rec authenticated json:", json)
            return json
        },
        refetchOnWindowFocus: true,
    })

    console.log(loading, user)

    const splashLoading = !fontsLoaded || loading;

    useEffect(() => {
        if (!splashLoading) SplashScreen.hideAsync();
    }, [splashLoading]);

    if (splashLoading) {
        return null;
    }

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