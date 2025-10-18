import { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform, useColorScheme  } from "react-native";
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

type Comment = {
  name: string,
  date: string,
  semester: string,
  body: string,
  id: number
}

export default function SectionScreen() {

    const colorScheme = useColorScheme()
    const { id:professorId }: {id: string} = useLocalSearchParams()
    const { user } = useAuth()
    const [comments, setComments] = useState<Comment[]>([])
    const onComment = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev])
    }

    useEffect(() => {
        const info = data.courses.find(c =>
            c.professors?.some(section => section.id === professorId)
        )
        const professor = info?.professors?.find(s => s.id === professorId)
        if (professor) {
            setComments(professor.comments)
        }
    }, [])

    return (
        <KeyboardAvoidingView
            className="flex-1 dark:bg-gray-800"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <View className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Comments</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <View className="flex-1">
                    <FlatList
                        data={comments}
                        renderItem={(item) => (
                            <CommentItem comment={item.item} />
                        )}
                        keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
                        numColumns={1}
                        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={false}
                        indicatorStyle="black"
                    />
                </View>
            </View>
            <View className="pb-[25px] pt-[10px] bg-black dark:bg-gray-800 flex items-center justify-center">
                <View className="w-[90%]">
                    <CommentInput onComment={onComment} user={user} colorScheme={colorScheme} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

type CommentItemProps = {
    comment: Comment
}

const ControlButton = ({title, onPress}: {title: string, onPress: () => void}) => {
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
        opacity: opacity.value,
    }));
    
    return (
        <GestureDetector gesture={tap}>
            <Animated.View
                className="border-[1px] border-dark-100 w-[65px] h-[20px] px-1 flex items-center justify-center bg-light-200"
                style={animatedStyle}
            >
                <Text className="font-montserrat-bold text-white text-sm">{title}</Text>
            </Animated.View>
        </GestureDetector>
    )
}

const CommentItem = ({comment}: CommentItemProps) => {
    // const [replying, setReplying] = useState(false)
    // const [comments, setComments] = useState(comment.comments)
    // const onComment = (newComment: Comment) => {
    //     setComments(prev => [newComment, ...prev])
    //     setReplying(false) // Auto-close after replying
    // }

    return (
        <View className="flex flex-col border-l-[1px] border-dark-100 dark:border-light-200 p-3 gap-4">
            <View>
                <Text className="font-montserrat-semibold text-md dark:text-white">{comment.name}</Text>
                <Text className="font-montserrat-medium text-sm text-light-200 dark:text-light-100">{`${comment.date}; ${comment.semester}`}</Text>
            </View>
            <Text className="font-montserrat text-md dark:text-white">{comment.body}</Text>
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

type CommentInputProps = {
    onComment: (newComment: Comment) => void,
    user: any,
    colorScheme: string | null | undefined
}

const CommentInput = ({ onComment, user, colorScheme }: CommentInputProps) => {
    const [commentBody, setCommentBody] = useState("");
    const inputRef = useRef<TextInput>(null);

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        if (!commentBody.trim()) return;
        onComment({
            name: "dr johnson",
            date: "10/8/2025",
            body: commentBody,
            semester: "random semester",
            id: Math.floor(Math.random() * 10000) + 100,
        })
        setCommentBody("")
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
        opacity: user != null ? opacity.value : 0.5,
    }));

    return (
        <View className="w-full px-2 flex flex-row justify-between items-center gap-2">
            <TextInput
                ref={inputRef}
                value={commentBody}
                onChangeText={setCommentBody}
                placeholder={user ? "What are your thoughts?" : "Sign in to comment"}
                placeholderTextColor={user != null ? (colorScheme === "dark" ? "#aaa" : "#545a6d") : "#999"}
                multiline
                className={`font-montserrat flex-1 p-3 text-black dark:text-white rounded-full min-h-[40px] text-md ${user != null ? "bg-white dark:bg-gray-700" : "bg-light-100 dark:bg-gray-700"}`}
                textAlign="left"
                editable={user != null}
            />
            <GestureDetector gesture={tap}>
                <Animated.View
                    className="w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                    style={animatedStyle}
                >
                    <Ionicons name="send-outline" size={18} color="white" />
                </Animated.View>
            </GestureDetector>
        </View>
    )
};