import { Text, ActivityIndicator } from 'react-native'
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils"
import SpecificProfessorCourse from '@/components/professors/SpecificCourse';
import AllProfessorCourses from '@/components/professors/AllCourses';
import { useParsedLocalSearchParams } from '@/services/utils';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

type ProfessorParams = {
    id: string,
    courseId?: string,
    subjectName?: string,
    subjectAbbreviation?: string,
    courseAbbreviation?: string,
    getAll: boolean
}

const Professor = () => {

    const params = useParsedLocalSearchParams<ProfessorParams>((raw) => ({
        id: raw.id!,
        courseId: raw.courseId,
        subjectName: raw.subjectName,
        subjectAbbreviation: raw.subjectAbbreviation,
        courseAbbreviation: raw.courseAbbreviation,
        getAll: raw.getAll === "true",
    }))

    const { id: professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation, getAll } = params
    const navigation = useNavigation()
    const endpoint = getAll ? `/professors/${professorId}/courses` : `/professors/${courseId}/${professorId}`

    const { isLoading:loading, isSuccess:success, error, data } = useQuery({
        queryKey: ["specific-professor", professorId, courseId, getAll === true ? "all" : "course"],
        queryFn: async () => {
            try {
                const response = await api.get(endpoint)
                return response.data
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const customMessage = error.response.data.message
                    throw new Error(customMessage || 'An error occurred')
                }
                throw error
            }
        },
        refetchOnWindowFocus: true
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