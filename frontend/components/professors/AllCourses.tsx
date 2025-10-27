import { View, Text } from 'react-native'
import React from 'react'
import { FavoriteSection as ProfessorCourseSection } from '@/app/(tabs)/home/[category]'
import { FavoriteCourse as ProfessorCourse } from '@/app/(tabs)/home'

import { useMutation } from '@tanstack/react-query'
import { SafeAreaView } from 'react-native-safe-area-context'

const AllProfessorCourses = ({courses, params}: {courses: ProfessorCourse[], params: {professorId: string}}) => {

    // favorite functionality here (use mutation here) also in a course[id] itself

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text>AllCourses</Text>
        </SafeAreaView>
    )
}

export default AllProfessorCourses