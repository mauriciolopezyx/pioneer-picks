import { View, Text, KeyboardAvoidingView, Platform, ActivityIndicator, useColorScheme  } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router"
import { useAuth } from "@/components/AuthProvider";
import Slider from '@react-native-community/slider';
import { reviewOptions } from "@/services/utils";
import { GestureWrapper } from "@/app/(tabs)/home";

import { useQuery } from '@tanstack/react-query'
import api from "@/services/api";
import axios from "axios";

type Review = {
  name: string,
  date: string,
  semester: string,
  location: number,
  id: number,
  workload: number,
  leniency: number,
  assignments: number,
  communication: number,
  curve: boolean,
  attendance: boolean,
  late: boolean,
  textbook?: string,
  positive: string,
  negative: string
}

export default function SectionScreen() {

    const { id:professorId, courseId }: {id: string, courseId: string} = useLocalSearchParams()
    const router = useRouter()
    const { user } = useAuth()
    const colorScheme = useColorScheme()

    const { isLoading:loading, error, data:reviews } = useQuery({
        queryKey: ["specific-course-professor-reviews", professorId, courseId],
        queryFn: async () => {
            try {
                const response = await api.get(`/reviews/${courseId}/${professorId}`)
                return response.data
            } catch (error) {
                if (axios.isAxiosError(error) && error.response) {
                    const customMessage = error.response.data.message
                    throw new Error(customMessage || 'An error occurred')
                }
                throw error
            }
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60,
        gcTime: 1000 * 60 * 5
    })
    
    if (loading) {
        return (
            <View className="flex-1 dark:bg-gray-800">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Reviews</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </View>
        )
    }

    if (error) {
        return (
            <View className="flex-1 dark:bg-gray-800">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Reviews</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <Text className="font-montserrat dark:text-white">Failed to load reviews: {error?.message}</Text>
            </View>
        )
    }

    if (!reviews) {
        return (
            <View className="flex-1 dark:bg-gray-800">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Reviews</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <Text className="font-montserrat dark:text-white">Failed to load reviews (no data found)</Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            className="relative flex-1 dark:bg-gray-800"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <View className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Reviews</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <View className="flex-1">
                    { reviews.length > 0 ? <FlashList
                        data={reviews}
                        renderItem={(item: any) => (
                            <Review key={item.item.id} review={item.item} />
                        )}
                        keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
                        numColumns={1}
                        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle="black"
                    /> : <Text className="font-montserrat dark:text-white mx-auto">No reviews found</Text> }
                </View>
            </View>
            
            <View className="absolute bottom-[30px] right-[30px]">
                <GestureWrapper
                    className="w-[75px] h-[75px] px-1 flex items-center justify-center rounded-full"
                    backgroundColor="#d50032"
                    onPress={() => { router.navigate({pathname: "/(modals)/professors/reviews/create", params: {professorId: professorId, courseId: courseId}}) }}
                >
                    <Ionicons name={user ? "add-outline" : "close-outline"} size={35} color="white" />
                </GestureWrapper>
            </View>
        </KeyboardAvoidingView>
    );
}

type ReviewItemProps = {
    review: Review
}

const Review = ({ review }: ReviewItemProps) => {
    return (
        <View className="flex flex-col border-l-[1px] border-dark-100 dark:border-light-200 p-3 gap-4">
            <View>
                <Text className="font-montserrat-semibold text-md dark:text-white">{review.name}</Text>
                <Text className="font-montserrat-medium text-sm text-light-200 dark:text-light-100">{`${review.date}; Took in ${review.semester}`}</Text>
            </View>
            <View className="flex flex-row flex-wrap gap-2">
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.location === 0 ? "bg-blue-600" : "bg-green-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.location === 0 ? "Online" : review.location === 1 ? "In-person" : "Hybrid"}</Text>
                    {review.location === 0 ? <Ionicons name="laptop-outline" size={15} color="white" /> : <Ionicons name="person-outline" size={15} color="white" />}
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.late ? "bg-green-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">Late work: {review.late ? "Yes" : "No"}</Text>
                    {/* {review.late ? <Ionicons name="checkmark-outline" size={15} color="white" /> : <Ionicons name="close-outline" size={15} color="white" />} */}
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.attendance ? "bg-blue-600" : "bg-green-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">Graded attendance: {review.attendance ? "Yes" : "No"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.curve ? "bg-green-600" : "bg-blue-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">Curved exams: {review.curve ? "Yes" : "No"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full bg-blue-600`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.assignments === 0 ? "Exam heavy" : review.assignments === 1 ? "Classwork heavy" : "Balanced exams & classwork"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.leniency === 0 ? "bg-green-600" : review.leniency === 1 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.leniency === 0 ? "Lenient" : review.leniency === 1 ? "Slightly rigourous" : "Rigourous"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.communication === 0 ? "bg-green-600" : review.communication === 1 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.communication === 0 ? "Organized" : review.communication === 1 ? "Disorganized" : "Unorganized"}</Text>
                </View>
            </View>

            <Text className="font-montserrat-semibold text-md dark:text-white">Workload</Text>
            <View className="relative">
                <Slider
                    value={review.workload}
                    style={{width: 340, height: 15}}
                    minimumValue={0}
                    maximumValue={3}
                    minimumTrackTintColor="#d50032"
                    maximumTrackTintColor="#000000"
                    thumbTintColor="#d50032"
                    step={1}
                    disabled={true}
                />
                <Text className="absolute bg-black text-white rounded-full px-2 py-1 text-xs font-montserrat-bold -bottom-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{reviewOptions.workload[review.workload]} hours</Text>
            </View>

            <Text className="font-montserrat-semibold text-md dark:text-white">Textbook</Text>
            <Text className="font-montserrat dark:text-white">{review?.textbook ? review.textbook : "Not specified"}</Text>
            
            <Text className="font-montserrat-semibold text-md dark:text-white">What worked</Text>
            <Text className="font-montserrat text-md dark:text-white">{review.positive}</Text>

            <Text className="font-montserrat-semibold text-md dark:text-white">What to look out for</Text>
            <Text className="font-montserrat text-md dark:text-white">{review.negative}</Text>
        </View>
    )
}