import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Button } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from "@/components/AuthProvider";
import Slider from '@react-native-community/slider';
import { reviewOptions } from "@/services/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router"
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { ToastInstance } from "@/components/ToastWrapper";
import MasterToast from "@/components/ToastWrapper"

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";

type Form = {
    season: string
    year: string,
    workload: number,
    location: number,
    leniency: number,
    assignments: number,
    communication: number,
    curve: boolean,
    attendance: boolean,
    late: boolean,
    textbook: string,
    positive: string,
    negative: string
}

export default function SectionScreen() {

    const { professorId, courseId }: {professorId: string, courseId: string} = useLocalSearchParams()
    const { user } = useAuth()
    const router = useRouter()

    const [form, setForm] = useState<Form>({
        season: "Fall",
        year: "2025",
        workload: 3,
        location: 0,
        leniency: 0,
        assignments: 0,
        communication: 0,
        curve: false,
        attendance: false,
        late: false,
        textbook: "",
        positive: "",
        negative: ""
    })
    const onFormUpdate = (key: string, value: any) => {
        setForm((prev) => ({...prev, [key]: value}))
    }

    const {isPending:commentPending, isError, error:commentError, mutate:onReview} = useMutation({
        mutationFn: async () => {
            console.log("attempting to post review with:", form)
            if (form.positive.trim() === "" || form.negative.trim() === "") {
                const extra1 = form.positive.trim() === "" ? "What worked?" : ""
                const extra2 = form.negative.trim() === "" ? "What to look out for?" : ""
                throw new Error(`The following fields are required: ${extra1} ${extra2}`)
            }
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/reviews/${courseId}/${professorId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
                body: JSON.stringify({
                   ...form,
                   ["season"]: undefined,
                   ["year"]: undefined,
                   ["semester"]: form.season + " " + form.year,
                   ["textbook"]: form.textbook.trim() != "" ? form.textbook : null
                })
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
        },
        onSuccess: () => {
            console.log("successfully posted review!")
            router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: professorId, courseId: courseId} })
            MasterToast.show({
                text1: "Successfully posted review!"
            })
        },
        onError: (e: any) => {
            console.error(e?.message ?? "Failed to verify")
        }
    })

    const { showActionSheetWithOptions } = useActionSheet()

    return (
        <KeyboardAvoidingView
            className="relative flex-1 dark:bg-gray-800"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <ScrollView className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto dark:text-white">Create Review</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Semester <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"season"} title={form.season} showActionSheetWithOptions={showActionSheetWithOptions} options={["Spring", "Summer", "Fall", "Winter", "Cancel"]} onFormUpdate={onFormUpdate} />
                        <FormActionButton field={"year"} title={form.year} showActionSheetWithOptions={showActionSheetWithOptions} options={["<2020", "2021", "2022", "2023", "2024", "2025", "Cancel"]} onFormUpdate={onFormUpdate} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Location <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"location"} title={reviewOptions.location[form.location]} showActionSheetWithOptions={showActionSheetWithOptions} options={reviewOptions.location} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Workload <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="relative">
                        <Slider
                            value={form.workload}
                            onValueChange={(newValue) => { setForm((prev) => ({...prev, ["workload"]: newValue})) }}
                            style={{width: 200, height: 40}}
                            minimumValue={0}
                            maximumValue={3}
                            minimumTrackTintColor="#d50032"
                            maximumTrackTintColor="#000000"
                            thumbTintColor="#d50032"
                            step={1}
                        />
                        <Text className="absolute bg-black text-white rounded-full px-2 py-1 text-xs font-montserrat-bold -bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">{reviewOptions.workload[form.workload]} hours</Text>
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 file:overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Leniency <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"leniency"} title={reviewOptions.leniency[form.leniency]} showActionSheetWithOptions={showActionSheetWithOptions} options={reviewOptions.leniency} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 file:overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Assignments <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"assessment"} title={form.assignments != 2 ? reviewOptions.assessment[form.assignments] : "Balanced"} showActionSheetWithOptions={showActionSheetWithOptions} options={reviewOptions.assessment} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Communication <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"communication"} title={reviewOptions.communication[form.communication]} showActionSheetWithOptions={showActionSheetWithOptions} options={reviewOptions.communication} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Curved exams <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.curve ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["curve"]: !prev.curve})) } } />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Graded attendance <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.attendance ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["attendance"]: !prev.attendance})) } } />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl dark:text-white">Late work accepted <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.late ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["late"]: !prev.late})) } } />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl dark:text-white">Textbook <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="w-full">
                        <TextInput
                            value={form.textbook}
                            onChangeText={(newText) => { setForm((prev) => ({...prev, ["textbook"]: newText})) }}
                            className="font-montserrat text-lg text-primary dark:text-white"
                            placeholder="Enter a textbook title"
                            placeholderTextColor={"#999"}
                        />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl dark:text-white">What worked <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="w-full h-[150px]">
                        <TextInput
                            value={form.positive}
                            onChangeText={(newText) => { setForm((prev) => ({...prev, ["positive"]: newText})) }}
                            className="w-full h-full font-montserrat text-lg text-primary dark:text-white"
                            placeholder="Describe XYZ..."
                            placeholderTextColor={"#999"}
                            multiline
                        />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl dark:text-white">What to look out for <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="w-full h-[150px]">
                        <TextInput
                            value={form.negative}
                            onChangeText={(newText) => { setForm((prev) => ({...prev, ["negative"]: newText})) }}
                            className="w-full h-full font-montserrat text-lg text-primary dark:text-white"
                            placeholder="Describe XYZ..."
                            placeholderTextColor={"#999"}
                            multiline
                        />
                    </View>
                </View>
                <View className="bg-transparent h-[65px]"></View>
            </ScrollView>
            <View className="absolute w-[250px] bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FormToggleButton title="Post" user={user} onPress={onReview} className="flex flex-row gap-x-2 items-center justify-center bg-blue-600 w-full py-2 rounded-full"/>
            </View>
            <ToastInstance />
        </KeyboardAvoidingView>
    );
}

type FormActionButtonProps = {
    field: string,
    title: string,
    showActionSheetWithOptions: any,
    options: string[],
    onFormUpdate: (key: string, value: string) => void,
    useIndex?: boolean
}

const FormActionButton = ({ field, title, showActionSheetWithOptions, options, onFormUpdate, useIndex }: FormActionButtonProps) => {
    const onPress = () => {
        const destructiveButtonIndex = -1
        const cancelButtonIndex = options.length - 1

        showActionSheetWithOptions({ options, cancelButtonIndex, destructiveButtonIndex }, (i: any) => {
            switch (i) {
                case destructiveButtonIndex:
                    break
                case cancelButtonIndex:
                    break
                default:
                    onFormUpdate(field, !useIndex ? options[i] : i)
                    break
            }}
        )
    }
    return (
        <Button title={title} color="#d50032" onPress={onPress} />
    )
}

const FormToggleButton = ({title, user, onPress, className}: {title: string, user: any, onPress: () => void, className?: string}) => {
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
                className={className ? className : "px-4 py-2 flex items-center justify-center rounded-full"}
                style={animatedStyle}
            >
                <Text className={className ? "text-white text-xl font-montserrat-semibold" : "text-primary text-xl"}>{title}</Text>
                {className ? <Ionicons name="send-outline" size={12} color="white" /> : null}
            </Animated.View>
        </GestureDetector>
    )
}