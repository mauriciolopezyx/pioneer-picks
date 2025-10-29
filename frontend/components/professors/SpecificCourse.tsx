import { Text, View, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { GestureWrapper } from '@/app/(tabs)/home';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

// params should be { id:professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation }

type SpecificProfessorCourseProps = {
    professor: {
        id: string,
        name: string,
        reviewCount: number,
        commentCount: number
    },
    params: {
        professorId: string,
        courseId: string,
        subjectName: string,
        subjectAbbreviation: string,
        courseAbbreviation: string
    }
}
const SpecificProfessorCourse = ({professor, params}: SpecificProfessorCourseProps) => {

    const colorScheme = useColorScheme()
    const router = useRouter()

   // const paletteKey = subjectColorMappings[subjectName.toLowerCase()] ?? 0
    //const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
    //const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text className="font-montserrat-bold text-4xl mb-4 dark:text-white">{professor.name}</Text>

            <View className="flex flex-row items-center justify-start">
                {/* <View style={{backgroundColor: bgColor}} className="rounded-full px-4 py-1 mb-8">
                    <Text className="font-montserrat-semibold text-md dark:text-white">{`${subjectName} ${courseAbbreviation}`}</Text>
                </View> */}

                <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={() => {}} >
                    <Ionicons name="bookmark-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                </GestureWrapper>
                    
            </View>

            {/* <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Courses</Text>
            <View className="flex flex-row gap-5 w-full mb-8">
                <View className={`flex justify-center items-center py-2 px-4 rounded-full`} style={{ backgroundColor: bgColor }}>
                    <Text className={`font-montserrat-bold text-sm ${textColor}`}>{"null"}</Text>
                </View>
            </View> */}

            {/* <View className="border-t-[1px] mb-8"></View> */}

            <View className="border-t-[1px] dark:border-white"></View>
            
            <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: params.professorId, courseId: params.courseId}}) } }>
                <View className="flex flex-row justify-center items-center gap-x-2">
                    <Text className="font-montserrat-medium text-xl dark:text-white">Reviews</Text>
                    <Text className="font-montserrat-semibold text-2xl dark:text-white">(${professor.reviewCount})</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
            </GestureWrapper>

            <View className="border-t-[1px] dark:border-white"></View>
            
            <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { router.navigate({pathname: "/(modals)/professors/comments/[id]", params: {id: params.professorId, courseId: params.courseId}}) } }>
                <View className="flex flex-row justify-center items-center gap-x-2">
                    <Text className="font-montserrat-medium text-xl dark:text-white">Comments</Text>
                    <Text className="font-montserrat-semibold text-2xl dark:text-white">(${professor.commentCount})</Text>
                </View>
                <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
            </GestureWrapper>

        </SafeAreaView>
    )
}

export default SpecificProfessorCourse