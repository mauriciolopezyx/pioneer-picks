import { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform  } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router"
import data from "@/assets/english.json"
import { useAuth } from "@/components/AuthProvider";
import { LinearGradient } from 'expo-linear-gradient';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Review = {
  name: string,
  date: string,
  semester: string,
  location: number,
  id: number,
  workload: number,
  leniency: number,
  assessment: number,
  communication: number,
  curve: boolean,
  attendance: boolean,
  late: boolean,
  textbook?: string,
  positive: string,
  negative: string
}

export default function SectionScreen() {

    const { id:professorId }: {id: string} = useLocalSearchParams()
    const { user, loading } = useAuth()
    const [reviews, setReviews] = useState<Review[]>([])
    const onComment = (newComment: Review) => {
        setReviews(prev => [newComment, ...prev])
    }

    useEffect(() => {
        const info = data.courses.find(c =>
            c.professors?.some(section => section.id === professorId)
        )
        const professor = info?.professors?.find(s => s.id === professorId)
        if (professor) {
            setReviews(professor.reviews)
        }
    }, [])

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <View className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto">Reviews</Text>
                <View className="border-t-[1px] mb-8"></View>
                <View className="flex-1">
                    <FlatList
                        data={reviews}
                        renderItem={(item) => (
                            <Review review={item.item} />
                        )}
                        keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
                        numColumns={1}
                        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        scrollEnabled={true}
                        indicatorStyle="black"
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

type ReviewItemProps = {
    review: Review
}

const Review = ({ review }: ReviewItemProps) => {
    return (
        <View className="flex flex-col border-l-[1px] border-dark-100 p-3 gap-4">
            <View>
                <Text className="font-montserrat-semibold text-md">{review.name}</Text>
                <Text className="font-montserrat-medium text-sm text-light-200">{`${review.date}; ${review.semester}`}</Text>
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
                    <Text className="text-sm font-montserrat-bold text-white">{review.assessment === 1 ? "Exam heavy" : review.assessment === 2 ? "Classwork heavy" : "Balanced exams & classwork"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.leniency === 1 ? "bg-green-600" : review.leniency === 2 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.leniency === 1 ? "Lenient" : review.leniency === 2 ? "Slightly rigourous" : "Rigourous"}</Text>
                </View>
                <View className={`flex flex-row gap-1 justify-center items-center px-3 py-1 rounded-full ${review.communication === 1 ? "bg-green-600" : review.communication === 2 ? "bg-blue-600" : "bg-red-600"}`}>
                    <Text className="text-sm font-montserrat-bold text-white">{review.communication === 1 ? "Organized" : review.communication === 2 ? "Disorganized" : "Unorganized"}</Text>
                </View>
            </View>

            <Text className="font-montserrat-semibold text-md">Workload, hours</Text>
            <View className="relative">
                <View className="w-full h-[5px] rounded-full overflow-hidden">
                    <LinearGradient
                        colors={['#16A34A', '#FACC15', '#DC2626']} // green-600 → yellow-400 → red-600
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                </View>
                <View className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rounded-full aspect-square border-light-200 bg-black p-2">
                    <Text className="font-montserrat-bold text-white text-xs">{review.workload === 1 ? "<5" : review.workload === 2 ? "<10" : review.workload === 3 ? "<15" :"15+"}</Text>
                </View>
            </View>

            <Text className="font-montserrat-semibold text-md">Textbook</Text>
            <Text className="font-montserrat">{review?.textbook ? review.textbook : "Not specified"}</Text>
            
            <Text className="font-montserrat-semibold text-md">What worked</Text>
            <Text className="font-montserrat text-md">{review.positive}</Text>

            <Text className="font-montserrat-semibold text-md">What to look out for</Text>
            <Text className="font-montserrat text-md">{review.negative}</Text>

            {/* {replying ? (
                <ControlButton title="Cancel" onPress={() => setReplying(false)}/>
            ) : (
                <ControlButton title="Reply" onPress={() => setReplying(true)}/>
            )}
            {replying ? <CommentInput onComment={onComment} /> : null}
            <View className="Flex flex-col gap-3">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </View> */}
        </View>
    )
}