import { View, Text, KeyboardAvoidingView, Platform, ActivityIndicator  } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from "expo-router"
import { useAuth } from "@/components/AuthProvider";
import Slider from '@react-native-community/slider';
import { reviewOptions } from "@/services/utils";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

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

    const { isLoading:loading, isSuccess:success, error, data:reviews } = useQuery({
        queryKey: ["specific-course-professor-reviews", professorId, courseId],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/reviews/${courseId}/${professorId}`, {
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
                <Text>Failed to load reviews: {error?.message}</Text>
            </View>
        )
    }

    if (!reviews) {
        return (
            <View className="flex-1 dark:bg-gray-800">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Reviews</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <Text>Failed to load reviews (no data found)</Text>
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
                    <FlashList
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
                    />
                </View>
            </View>
            <View className="absolute bottom-[30px] right-[30px]">
                <ControlButton user={user} onPress={() => { router.navigate({pathname: "/(modals)/professors/reviews/create", params: {professorId: professorId, courseId: courseId}}) }} />
            </View>
        </KeyboardAvoidingView>
    );
}

const ControlButton = ({user, onPress}: {user: any, onPress: () => void}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        onPress()
    };

    const tap = Gesture.Tap()
        .onBegin(() => {
            scale.value = withTiming(0.97, { duration: 80 });
            opacity.value = withTiming(0.7, { duration: 80 });
        })
        .onFinalize(() => {
            scale.value = withTiming(1, { duration: 150 });
            opacity.value = withTiming(1, { duration: 150 });
        })
        .onEnd(() => {
            scheduleOnRN(handleSubmit);
        });
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: user ? opacity.value : 0.25,
    }));
    
    return (
        <GestureDetector gesture={tap}>
            <Animated.View
                className="w-[75px] h-[75px] px-1 flex items-center justify-center bg-black dark:bg-light-200 rounded-full"
                style={animatedStyle}
            >
                <Ionicons name={user ? "add-outline" : "close-outline"} size={35} color="white" />
            </Animated.View>
        </GestureDetector>
    )
}

type ReviewItemProps = {
    review: Review
}

const Review = ({ review }: ReviewItemProps) => {
    return (
        <View className="flex flex-col border-l-[1px] border-dark-100 dark:border-light-200 p-3 gap-4">
            <View>
                <Text className="font-montserrat-semibold text-md dark:text-white">{review.name}</Text>
                <Text className="font-montserrat-medium text-sm text-light-200 dark:text-light-100">{`${review.date}; ${review.semester}`}</Text>
            </View>
            <View className="flex flex-row flex-wrap gap-2">
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.location === 1 ? "bg-blue-600" : "bg-green-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.location === 1 ? "Online" : "In-person"}</Text>
                    {review.location === 1 ? <Ionicons name="laptop-outline" size={15} color="white" /> : <Ionicons name="person-outline" size={15} color="white" />}
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
                    <Text className="text-sm font-montserrat-bold text-white">{review.assignments === 1 ? "Exam heavy" : review.assignments === 2 ? "Classwork heavy" : "Balanced exams & classwork"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.leniency === 1 ? "bg-green-600" : review.leniency === 2 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.leniency === 1 ? "Lenient" : review.leniency === 2 ? "Slightly rigourous" : "Rigourous"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.communication === 1 ? "bg-green-600" : review.communication === 2 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.communication === 1 ? "Organized" : review.communication === 2 ? "Disorganized" : "Unorganized"}</Text>
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