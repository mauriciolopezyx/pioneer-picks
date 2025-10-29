import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, useColorScheme } from "react-native";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";

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
type Comment = {
  name: string,
  date: string,
  semester: string,
  body: string,
  id: number
}

type SubjectCourseProps = {
  name: string,
  abbreviation: string
}

type Professor = {
  name: string,
  id: string,
  reviewCount: number,
  commentCount: number
}

type CourseProps = {
  id: string,
  abbreviation: string
}

const ProfessorCard = ({ professor, course, subject }: {professor: Professor, course: CourseProps, subject: SubjectCourseProps}) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const paletteKey = subjectColorMappings[subject.name.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
  const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
    router.navigate({
      pathname: "/(tabs)/discover/professors/[id]",
      params: { id: professor.id, courseId: course.id, subjectName: subject.name, subjectAbbreviation: subject.abbreviation, courseAbbreviation: course.abbreviation, getAll: "false" },
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
                {`${professor.reviewCount} Review${professor.reviewCount == 1 ? "" : "s"}`}, {"4 Semesters"}
            </Text>
        </View>
        <View>
            <Ionicons name="chevron-forward-outline" size={30} color="white" />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default ProfessorCard