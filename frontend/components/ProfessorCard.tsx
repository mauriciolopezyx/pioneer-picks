import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { courseColorPalette } from "@/services/utils";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

// type Section = {
//     sectionId: string,
//     professor: string,
//     schedule: string,
//     location: string
// }

type Review = {
  name: string
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
  textbook?: string
}
type Comment = {
  name: string,
  date: string,
  semester: string,
  body: string,
  id: number
}
type Professor = {
  name: string,
  id: string,
  reviews: Review[],
  comments: Comment[]
}

const ProfessorCard = ({ item:professor, index, course, subject }: {item: Professor, index: number, course: string, subject: string}) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const bgColor = courseColorPalette[subject.toLowerCase()]?.primary ?? "#000";
  const textColor = courseColorPalette[subject.toLowerCase()]?.secondary ?? "text-white"

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
    router.navigate({
      pathname: "/(tabs)/discover/courses/professors/[id]",
      params: { id: professor.id, course, subject },
    })
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
    backgroundColor: bgColor
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
          className="flex flex-row justify-between items-center flex-1 h-24 rounded-lg p-3 overflow-hidden bg-light-100"
          style={animatedStyle}
      >
        <View>
            <Text numberOfLines={1} className={`text-xl font-montserrat-bold ${textColor}`}>
                {professor.name}
            </Text>
            <Text className={`font-montserrat-semibold ${textColor}`}>
                {`${professor.reviews.length} Review${professor.reviews.length == 1 ? "" : "s"}`}, {"4 Semesters"}
            </Text>
        </View>
        <View>
            <Ionicons name="chevron-forward-outline" size={30} color="white" />
        </View>


        {/* <Ionicons
          name={iconName}
          size={100} // big enough to overflow
          color="rgba(255,255,255,0.7)"
          style={{
            position: "absolute",
            bottom: -15,
            right: -15,
          }}
        /> */}
      </Animated.View>
    </GestureDetector>
  );
};

export default ProfessorCard