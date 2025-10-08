import { useState, useRef } from "react";
import { View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform  } from "react-native";
import { Ionicons } from '@expo/vector-icons';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Comment = {
    body: string,
    id: number
    comments: Comment[]
}

const dummyComments: Comment[] = [
    {
        body: "This is comment 1",
        id: 1,
        comments: []
    },
    {
        body: "This is comment 2",
        id: 2,
        comments: []
    },
    {
        body: "She's an okay professor, harsh at grading, attendance is mandatory. Do yourself a favor though and avoid her morning classes, it's so exhausting",
        id: 3,
        comments: []
    },
]

export default function SectionScreen() {
    const [comments, setComments] = useState(dummyComments)
    const onComment = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev])
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <View className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto">Comments</Text>
                <View className="border-t-[1px] mb-8"></View>
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
                        indicatorStyle="black"
                    />
                </View>
            </View>
            <View className="border-t-[1px] border-gray-200 pb-[25px] pt-[10px] bg-black flex items-center justify-center">
                <View className="w-[90%]">
                    <CommentInput onComment={onComment} />
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
        <View className="flex flex-col border-l-[1px] border-dark-100 p-3 gap-4">
            <View>
                <Text className="font-montserrat-semibold text-md">Ulysses Johnson</Text>
                <Text className="font-montserrat-medium text-sm text-light-200">Oct 10, 2025; Spring 2025</Text>
            </View>
            <Text className="font-montserrat text-md">{comment.body}</Text>
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
    onComment: (newComment: Comment) => void
}

const CommentInput = ({ onComment }: CommentInputProps) => {
    const [commentBody, setCommentBody] = useState("");
    const inputRef = useRef<TextInput>(null);

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        if (!commentBody.trim()) return;
        onComment({
            body: commentBody,
            comments: [],
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
        opacity: opacity.value,
    }));

    return (
        <View className="w-full px-2 flex flex-row justify-between items-center gap-2">
            <TextInput
                ref={inputRef}
                value={commentBody}
                onChangeText={setCommentBody}
                placeholder="What are your thoughts?"
                placeholderTextColor={"#555"}
                multiline
                className="font-montserrat-medium flex-1 bg-white border-[1px] p-3 border-dark-100 text-black rounded-full min-h-[40px] text-md"
                textAlign="left"
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