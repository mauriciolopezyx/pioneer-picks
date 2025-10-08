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

// {
//     "courseId": "ENGL-101",
//     "shortName": "ENGL 101",
//     "fullName": "Introduction to Composition",
//     "units": 3,
//     "attributes": ["1A", "A2", "LD"],
//     "description": "Development of fundamental writing skills with emphasis on structure, clarity, and academic argumentation.",
//     "sections": [
//     {
//         "sectionId": "ENGL-101-01",
//         "professor": "Dr. Smith",
//         "schedule": "MWF 10:00-11:00 AM",
//         "location": "MI 201"
//     },
//     {
//         "sectionId": "ENGL-101-02",
//         "professor": "Dr. Johnson",
//         "schedule": "TuTh 1:00-2:15 PM",
//         "location": "MI 305"
//     }
//     ]
// }

type Section = {
    sectionId: string,
    professor: string,
    schedule: string,
    location: string
}
type Course = {
    courseId: string,
    shortName: string,
    fullName: string,
    units: number,
    attributes: string[],
    description: string,
    sections: Section[]
}

const CourseCard = ({ item, index, subject }: {item: Course, index: number, subject: string}) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const bgColor = courseColorPalette[subject.toLowerCase()]?.primary ?? "#000";
  const textColor = courseColorPalette[subject.toLowerCase()]?.secondary ?? "text-white"

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
    router.navigate({
        pathname: "/(tabs)/discover/course/[id]",
        params: { id: item.courseId, subject: subject },
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
          <Text numberOfLines={1} className={`text-xl font-bold ${textColor}`}>
              {item.courseId}
          </Text>
          <Text className={`font-montserrat-semibold ${textColor}`}>
              {item.fullName}
          </Text>
          <Text className={`font-montserrat ${textColor}`}>
              {item.attributes.join(", ")}
          </Text>
        </View>
        <View>
          <Text className={`font-montserrat-bold text-4xl ${textColor}`}>
              {item.units}
          </Text>
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

export default CourseCard