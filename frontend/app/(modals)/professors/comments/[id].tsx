import { useState, useRef, useCallback } from "react";
import { View, Text, TextInput, KeyboardAvoidingView, Platform, useColorScheme, ActivityIndicator  } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router"
import { useAuth } from "@/components/AuthProvider";

import { ToastInstance } from "@/components/ToastWrapper";
import MasterToast from "@/components/ToastWrapper"

import { useQuery, useMutation, useInfiniteQuery } from "@tanstack/react-query";
import api from "@/services/api";
import axios from "axios";

import { GestureWrapper } from "@/app/(tabs)/home";

type Comment = {
  name: string,
  date: any,
  body: string,
  id: string
}

export default function SectionScreen() {

    const colorScheme = useColorScheme()
    const { id:professorId, courseId }: {id: string, courseId: string} = useLocalSearchParams()
    const { user } = useAuth()

    const [commentBody, setCommentBody] = useState("")
    const onChangeBody = useCallback((text: string) => {
        setCommentBody(text)
    }, [])

    const {mutate:onComment} = useMutation({
        mutationFn: async () => {
            console.log("attempting to post comment with body:", commentBody)
            if (commentBody.trim() === "") {
                throw new Error("Cannot have empty comment body!")
            }
            const response = await api.post(`/comments/${courseId}/${professorId}`, {body: commentBody})
            return true
        },
        onSuccess: () => {
            console.log("successfully posted comment")
            setCommentBody("")
            refetchComments()
            MasterToast.show({
                text1: "Successfully posted comment!"
            })
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to verify")
            MasterToast.show({
                text1: "Error posting comment",
                text2: e?.message ?? "Failed to post"
            })
        }
    })

    // const { isLoading:loading, error, data:comments, refetch:refetchComments } = useQuery({
    //     queryKey: ["specific-course-professor-comments", professorId, courseId],
    //     queryFn: async () => {
    //         try {
    //             const response = await api.get(`/comments/${courseId}/${professorId}`)
    //             return response.data
    //         } catch (error) {
    //             if (axios.isAxiosError(error) && error.response) {
    //                 const customMessage = error.response.data.message
    //                 throw new Error(customMessage || 'An error occurred')
    //             }
    //             throw error
    //         }
    //     },
    //     refetchOnWindowFocus: false,
    //     staleTime: 1000 * 60,
    //     gcTime: 1000 * 60 * 5
    // })

    const {
        data,
        isLoading:loading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch:refetchComments
    } = useInfiniteQuery({
        queryKey: ["specific-course-professor-comments", professorId, courseId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get(`/comments/${courseId}/${professorId}?page=${pageParam}`)
            return response.data
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined
        },
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        // staleTime: 1000 * 60 * 5,
        // gcTime: 1000 * 60 * 5
    })

    if (loading) {
        return (
            <View className="flex-1 dark:bg-gray-800 p-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Comments</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </View>
        )
    }

    if (error) {
        return (
            <View className="flex-1 dark:bg-gray-800 p-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Comments</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <Text className="font-montserrat dark:text-white" style={{textAlign: "center"}}>Failed to load comments: {error?.message}</Text>
                <View className="pb-[25px] pt-[10px] bg-black dark:bg-gray-800 flex items-center justify-center">
                    <View className="w-[90%]">
                        <CommentInput onChangeText={onChangeBody} commentBody={commentBody} onComment={onComment} user={user} colorScheme={colorScheme} />
                    </View>
                </View>
            </View>
        )
    }

    const comments = data?.pages.flatMap(page => page.content) ?? []

    if (!comments || (comments && comments.length == 0) ) {
        return (
            <KeyboardAvoidingView
                className="flex-1 dark:bg-gray-800"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={55}
            >
                <View className="flex-1 p-5">
                    <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Comments</Text>
                    <View className="border-t-[1px] dark:border-white mb-8"></View>
                    <Text className="font-montserrat dark:text-white" style={{textAlign: "center"}}>No comments found</Text>
                </View>
                <View className="pb-[25px] pt-[10px] bg-black dark:bg-gray-800 flex items-center justify-center">
                    <View className="w-[90%]">
                        <CommentInput onChangeText={onChangeBody} commentBody={commentBody} onComment={onComment} user={user} colorScheme={colorScheme} />
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <KeyboardAvoidingView
            className="flex-1 dark:bg-gray-800"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <View className="flex-1 p-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Comments</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <FlashList
                    data={comments}
                    renderItem={(item: any) => (
                        <CommentItem comment={item.item} />
                    )}
                    keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
                    numColumns={1}
                    ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    scrollEnabled={true}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    indicatorStyle="black"

                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage()
                        }
                    }}
                    onEndReachedThreshold={0.5} // triggered when XX% from end
                    ListFooterComponent={() => {
                        if (isFetchingNextPage) {
                            return (
                            <View style={{ padding: 20 }}>
                                <ActivityIndicator size="small" color={colorScheme === "dark" ? "#fff" : "#000"} />
                            </View>
                            )
                        }
                        return null
                    }}
                />
            </View>
            <View className="pb-[25px] pt-[10px] bg-black dark:bg-gray-800 flex items-center justify-center">
                <View className="w-[90%]">
                    <CommentInput onChangeText={onChangeBody} commentBody={commentBody} onComment={onComment} user={user} colorScheme={colorScheme} />
                </View>
            </View>
            <ToastInstance />
        </KeyboardAvoidingView>
    );
}

type CommentItemProps = {
    comment: Comment
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
                <Text className="font-montserrat-medium text-sm text-light-200 dark:text-light-100">{`${comment.date}`}</Text>
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
    onChangeText: (text: string) => void,
    user: any,
    colorScheme: string | null | undefined,
    onComment: any,
    commentBody: string
}

const CommentInput = ({ onChangeText, onComment, commentBody, user, colorScheme }: CommentInputProps) => {

    const textInputRef = useRef<TextInput>(null)

    return (
        <View className="w-full px-2 flex flex-row justify-between items-center gap-2">
            <TextInput
                ref={textInputRef}
                value={commentBody}
                onChangeText={onChangeText}
                placeholder={user ? "What are your thoughts?" : "Sign in to comment"}
                placeholderTextColor={user != null ? (colorScheme === "dark" ? "#aaa" : "#545a6d") : "#999"}
                multiline
                className={`font-montserrat flex-1 p-3 text-black dark:text-white rounded-full min-h-[40px] text-md ${user != null ? "bg-white dark:bg-gray-700" : "bg-light-100 dark:bg-gray-700"}`}
                textAlign="left"
                editable={user != null}
            />
            <GestureWrapper className="w-10 h-10 rounded-full flex items-center justify-center" backgroundColor="#d50032" onPress={onComment}>
                <Ionicons name="send" size={18} color="white" />
            </GestureWrapper>
        </View>
    )
};