import { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform  } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router"
import data from "@/assets/english.json"
import { useAuth } from "@/components/AuthProvider";

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
                    <Text className="text-sm font-montserrat-bold text-white">Late work</Text>
                    {review.late ? <Ionicons name="checkmark-outline" size={15} color="white" /> : <Ionicons name="close-outline" size={15} color="white" />}
                </View>
            </View>
            <Text className="font-montserrat text-md">{review.positive}</Text>
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