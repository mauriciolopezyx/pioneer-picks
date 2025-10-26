import { Text, View, Pressable, useColorScheme, ActivityIndicator } from 'react-native'
import { useLocalSearchParams as originalUseLocalSearchParams , Link, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import { Ionicons } from '@expo/vector-icons';
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils"
import SpecificProfessorCourse from '@/components/professors/SpecificCourse';
import { FlashList } from "@shopify/flash-list";

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { useQuery, useMutation } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

type ProfessorParams = {
    id: string,
    courseId?: string,
    subjectName?: string,
    subjectAbbreviation?: string,
    courseAbbreviation?: string,
    getAll: boolean
}

export function useParsedLocalSearchParams<TParsed>(parser: (raw: Record<string, string | undefined>) => TParsed): TParsed {
  const rawParams = originalUseLocalSearchParams() as Record<string, string | undefined>;
  return parser(rawParams);
}

const Professor = () => {

    const colorScheme = useColorScheme()
    const router = useRouter()

    const params = useParsedLocalSearchParams<ProfessorParams>((raw) => ({
        id: raw.id!,
        courseId: raw.courseId,
        subjectName: raw.subjectName,
        subjectAbbreviation: raw.subjectAbbreviation,
        courseAbbreviation: raw.courseAbbreviation,
        getAll: raw.getAll === "true",
    }));

    const { id: professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation, getAll } = params;
    const navigation = useNavigation();

    const endpoint = getAll ? `/professors/${professorId}/courses` : `/professors/${courseId}/${professorId}`

    const { isLoading:loading, isSuccess:success, error, data } = useQuery({
        queryKey: ["specific-course-professor", professorId, courseId],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080${endpoint}`, {
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
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 48
    })

    useEffect(() => {
        if (subjectName) {
            navigation.setOptions({
                headerBackTitle: (subjectAbbreviation && courseAbbreviation) ? `${subjectAbbreviation} ${courseAbbreviation}` : "Search"
            });
        }
    }, [subjectName]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <Text>Failed to load professor: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <Text>Failed to load professor information (no data found)</Text>
            </SafeAreaView>
        )
    }

    if (getAll) {
        // since data will have all the courses that this professor has, 
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
                <Text>do get all functionality here later</Text>
            </SafeAreaView>
        )
    }

    const paletteKey = subjectColorMappings[subjectName!.toLowerCase()] ?? 0
    const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
    const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <SpecificProfessorCourse loading={loading} error={error} professor={data} params={{professorId: professorId, courseId: courseId!, subjectName: subjectName!, subjectAbbreviation: subjectAbbreviation!, courseAbbreviation: courseAbbreviation!}}/>
        </SafeAreaView>
    )
}

export default Professor