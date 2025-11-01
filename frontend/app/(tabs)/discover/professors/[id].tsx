import { Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams as originalUseLocalSearchParams } from 'expo-router'
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils"
import SpecificProfessorCourse from '@/components/professors/SpecificCourse';
import AllProfessorCourses from '@/components/professors/AllCourses';

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
    console.log("at professor/[id]. getAll?:", getAll)

    const { isLoading:loading, isSuccess:success, error, data } = useQuery({
        queryKey: ["specific-professor", professorId, courseId, getAll === true ? "all" : "course"],
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
            <SafeAreaView className="flex-1 dark:bg-gray-800">
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col justify-center items-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load professor: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col justify-center items-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load professor information (no data found)</Text>
            </SafeAreaView>
        )
    }

    if (getAll) {
        return (
            <AllProfessorCourses data={data} params={{professorId: professorId}} />
        )
    }

    return (
        <SpecificProfessorCourse professor={data} params={{professorId: professorId, courseId: courseId!, subjectName: subjectName!, subjectAbbreviation: subjectAbbreviation!, courseAbbreviation: courseAbbreviation!}}/>
    )
}

export default Professor