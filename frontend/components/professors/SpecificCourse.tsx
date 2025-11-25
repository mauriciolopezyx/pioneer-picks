import { Text, View, useColorScheme, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { GestureWrapper } from '@/app/(tabs)/home';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import api from '@/services/api';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { subjectColorMappings, revolvingColorPalette } from '@/services/utils';

// params should be { id:professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation }

type SpecificProfessorCourseProps = {
    params: {
        professorId: string,
        courseId: string,
        subjectName: string,
        subjectAbbreviation: string,
        courseAbbreviation: string
    }
}

type ProfessorInfo = {
    id: string,
    name: string,
    reviewCount: number,
    commentCount: number
}

const SpecificProfessorCourse = ({params}: SpecificProfessorCourseProps) => {

    const { isLoading:loading, error, data:professor } = useQuery({
        queryKey: ["specific-professor-course-info", params.professorId, params.courseId],
        queryFn: async () => {
            try {
                const response = await api.get(`/professors/${params.courseId}/${params.professorId}`)
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

    const colorScheme = useColorScheme()
    const router = useRouter()

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

    if (!professor) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col justify-center items-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load professor information (no data found)</Text>
            </SafeAreaView>
        )
    }

    const paletteKey = subjectColorMappings[params.subjectName.toLowerCase()] ?? 0
    const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
    const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <GestureWrapper
                onPress={() => {
                    router.navigate({
                        pathname: "/(tabs)/discover/professors/[id]",
                        params: { id: params.professorId, getAll: "true" },
                    })
                }}
            >
                <Text className="font-montserrat-bold text-4xl mb-4 dark:text-white underline">{professor.name}</Text>
            </GestureWrapper>

            <View className="flex flex-row items-center justify-between mb-6">
                <View style={{backgroundColor: bgColor}} className="rounded-full px-4 py-1">
                    <Text className={`font-montserrat-semibold text-md ${textColor}`} >{`${params.subjectName} ${params.courseAbbreviation}`}</Text>
                </View>
            </View>

            <View className="border-t-[1px] dark:border-white"></View>
            
            <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: params.professorId, courseId: params.courseId}}) } }>
                <View className="flex flex-row justify-center items-center gap-x-2">
                    <Text className="font-montserrat-medium text-xl dark:text-white">Reviews</Text>
                    <Text className="font-montserrat-semibold text-2xl dark:text-white">({professor.reviewCount})</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
            </GestureWrapper>

            <View className="border-t-[1px] dark:border-white"></View>
            
            <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { router.navigate({pathname: "/(modals)/professors/comments/[id]", params: {id: params.professorId, courseId: params.courseId}}) } }>
                <View className="flex flex-row justify-center items-center gap-x-2">
                    <Text className="font-montserrat-medium text-xl dark:text-white">Comments</Text>
                    <Text className="font-montserrat-semibold text-2xl dark:text-white">({professor.commentCount})</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
            </GestureWrapper>

        </SafeAreaView>
    )
}

export default SpecificProfessorCourse