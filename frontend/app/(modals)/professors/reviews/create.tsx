import { useState } from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Button, Modal, Pressable } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useAuth } from "@/components/AuthProvider";
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector, TextInput } from "react-native-gesture-handler";
import { set } from "react-hook-form";

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

type Form = {
    season: string
    year: string,
    location: number,
    leniency: number,
    assessment: number,
    communication: number,
    curve: boolean,
    attendance: boolean,
    late: boolean,
    textbook?: string
}

export default function SectionScreen() {

    const { user } = useAuth()

    //use zod only for the inputs
    // when submitting make sure to add 1 to forms

    const [form, setForm] = useState<Form>({
        season: "Fall",
        year: "2025",
        location: 0,
        leniency: 0,
        assessment: 0,
        communication: 0,
        curve: false,
        attendance: false,
        late: false,
        textbook: "",
    })
    const onFormUpdate = (key: string, value: any) => {
        setForm((prev) => ({...prev, [key]: value}))
    }

    const { showActionSheetWithOptions } = useActionSheet()

    // probably export as const
    const options = {
        location: ["Online", "In-person", "Hybrid", "Cancel"],
        leniency: ["Lenient", "Slightly rigourous", "Rigourous", "Cancel"],
        assessment: ["Exam heavy", "Classwork heavy", "Balanced exams & classwork", "Cancel"],
        communication: ["Organized", "Disorganized", "Unorganized", "Cancel"]
    }   

    const [wtlof, setWtlof] = useState("")

    const minHeight = 40;
    const maxHeight = 200;

    const calculateInputHeight = (contentHeight: number) => {
        const height = Math.min(maxHeight, Math.max(minHeight, contentHeight));
        return height;
    };

    const [inputHeight, setInputHeight] = useState(minHeight);

    return (
        <KeyboardAvoidingView
            className="relative flex-1"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <ScrollView className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto">Create Review</Text>
                <View className="border-t-[1px] mb-8"></View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Semester</Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"season"} title={form.season} showActionSheetWithOptions={showActionSheetWithOptions} options={["Spring", "Summer", "Fall", "Winter", "Cancel"]} onFormUpdate={onFormUpdate} />
                        <FormActionButton field={"year"} title={form.year} showActionSheetWithOptions={showActionSheetWithOptions} options={["<2020", "2021", "2022", "2023", "2024", "2025", "Cancel"]} onFormUpdate={onFormUpdate} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Location</Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"location"} title={options.location[form.location]} showActionSheetWithOptions={showActionSheetWithOptions} options={options.location} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Leniency</Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"leniency"} title={options.leniency[form.leniency]} showActionSheetWithOptions={showActionSheetWithOptions} options={options.leniency} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Assignments</Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"assessment"} title={form.assessment != 2 ? options.assessment[form.assessment] : "Balanced"} showActionSheetWithOptions={showActionSheetWithOptions} options={options.assessment} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Communication</Text>
                    <View className="flex flex-row items-center justify-center">
                        <FormActionButton field={"communication"} title={options.communication[form.communication]} showActionSheetWithOptions={showActionSheetWithOptions} options={options.communication} onFormUpdate={onFormUpdate} useIndex={true} />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Curved exams</Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.curve ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["curve"]: !prev.curve})) } } />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Graded attendance</Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.attendance ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["attendance"]: !prev.attendance})) } } />
                    </View>
                </View>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 overflow-hidden">
                    <Text className="font-montserrat-bold font-bold text-2xl">Late work accepted</Text>
                    <View className="flex flex-row items-center justify-center">
                       <FormToggleButton title={form.late ? "Yes" : "No"} user={true} onPress={() => { setForm((prev) => ({...prev, ["late"]: !prev.late})) } } />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl">Textbook</Text>
                    <View className="w-full">
                        <TextInput
                            className="font-montserrat text-lg text-primary"
                            placeholder="Enter a textbook title"
                            placeholderTextColor={"#999"}
                        />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl">What worked</Text>
                    <View className="w-full h-[150px]">
                        <TextInput
                            className="w-full h-full font-montserrat text-lg text-primary"
                            placeholder="Describe XYZ..."
                            placeholderTextColor={"#999"}
                            multiline
                        />
                    </View>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl">What to look out for</Text>
                    <View className="w-full h-[150px]">
                        <TextInput
                            className="w-full h-full font-montserrat text-lg text-primary"
                            placeholder="Describe XYZ..."
                            placeholderTextColor={"#999"}
                            multiline
                        />
                    </View>
                </View>
                <View className="bg-transparent h-[65px]"></View>
            </ScrollView>
            <View className="absolute w-[250px] bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <FormToggleButton title="Post" user={false} onPress={() => {}} className="flex flex-row gap-x-2 items-center justify-center bg-blue-600 w-full py-2 rounded-full"/>
            </View>
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