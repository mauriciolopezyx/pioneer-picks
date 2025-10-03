import { useState, useRef } from "react";
import { Modal, View, Text, FlatList, Pressable, TextInput, KeyboardAvoidingView, Platform  } from "react-native";
import { Ionicons } from '@expo/vector-icons';

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
        body: "This is comment 3",
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
            keyboardVerticalOffset={90} // tweak depending on header height
        >
        <View className="flex-1 p-5">
            <Text className="font-bold text-2xl mb-2">Reviews</Text>
            <View className="flex-1">
                <View className="bg-transparent rounded-t-2xl p-4 h-full">
                    <CommentInput onComment={onComment} />
                    <FlatList
                        data={comments}
                        renderItem={(item) => (
                            <CommentItem comment={item.item} />
                        )}
                        keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
                        numColumns={1}
                        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                        className="my-[30px]"
                        scrollEnabled={true}
                        indicatorStyle="black"
                    />
                </View>
            </View>
        </View>
        </KeyboardAvoidingView>
    );
}

type CommentItemProps = {
    comment: Comment
}

const CommentItem = ({comment}: CommentItemProps) => {
    const [replying, setReplying] = useState(false)
    const [comments, setComments] = useState(comment.comments)
    const onComment = (newComment: Comment) => {
        setComments(prev => [newComment, ...prev])
    }

    return (
        <View className="flex flex-col border-l-[2px] border-dark-100 p-3 gap-4">
            <Text className="text-lg">{comment.body}</Text>
            <Text className="text-md italic">Ulysses Johnson (Spring 2025)</Text>
            {replying ? (
                <Pressable
                    className="border-[1px] rounded-full border-dark-100 w-[80px] h-10 px-3 flex items-center justify-center bg-light-200"
                    onPress={() => setReplying(false)}
                >
                    <Text className="font-bold text-white">Cancel</Text>
                </Pressable>
            ) : (
                <Pressable
                    className="border-[1px] rounded-full border-dark-100 w-[80px] h-10 px-3 flex items-center justify-center bg-light-200"
                    onPress={() => setReplying(true)}
                >
                    <Text className="font-bold text-white">Reply</Text>
                </Pressable>
            )}
            {replying ? <CommentInput onComment={onComment} /> : null}
            <View className="Flex flex-col gap-3">
                {comments.map(comment => (
                    <CommentItem key={comment.id} comment={comment} />
                ))}
            </View>
        </View>
    )
}

type CommentInputProps = {
    onComment: (newComment: Comment) => void
}

const CommentInput = ({ onComment }: CommentInputProps) => {
    const [commentBody, setCommentBody] = useState("");
    const inputRef = useRef<TextInput>(null);

    return (
        <View className="w-full px-2">
            <View className="relative">
                <TextInput
                    ref={inputRef}
                    value={commentBody}
                    onChangeText={setCommentBody}
                    placeholder="What are your thoughts?"
                    placeholderTextColor={"#555"}
                    multiline
                    className="bg-white border-[1px] border-dark-100 text-black p-2 pr-10 rounded-lg min-h-[60px] text-lg"
                />

                <Pressable
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-primary flex items-center justify-center"
                    onPress={() => {
                        if (!commentBody.trim()) return;
                        onComment(
                            {
                                body: commentBody,
                                comments: [],
                                id: Math.floor(Math.random() * 10000) + 100,
                            })
                            setCommentBody("")
                        }
                    }
                >
                    <Ionicons name="send-outline" size={18} color="white" />
                </Pressable>
            </View>
        </View>
    )
};
