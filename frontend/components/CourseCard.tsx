import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";
import { areas, revolvingColorPalette, subjectColorMappings, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

type Section = {
    sectionId: string,
    professor: string,
    schedule: string,
    location: string
}
// type Course = {
//     courseId: string,
//     shortName: string,
//     fullName: string,
//     units: number,
//     areas: string[],
//     description: string,
//     sections: Section[]
// }

type SubjectCourseProps = {
  name: string,
  abbreviation: string
}

type Course = {
  id: string,
  name: string,
  abbreviation: string, // 300, 405, etc
  units: number,
  areas: string
}

const CourseCard = ({ course, subject }: { course: Course, subject: SubjectCourseProps }) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const paletteKey = subjectColorMappings[subject.name.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
  const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
    router.navigate({
        pathname: "/(tabs)/discover/courses/[id]",
        params: { id: course.id, subjectName: subject.name, subjectAbbreviation: subject.abbreviation },
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

  const seen = new Set()
  const areaDisplays = course.areas.split(",").map((area) => {
    if (seen.has(area)) return null
    if (areaAbbreviations[area] && seen.has(areaAbbreviations[area])) return null

    seen.add(area)
    const parentArea = findAreaParentKey(areas, area)
    const bgAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].primary : "transparent"
    const textAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].secondary : "text-white"

    if (areaAbbreviations[area]) {
        seen.add(areaAbbreviations[area])
        return (
          <View key={areaAbbreviations[area]} className="rounded-full px-2 py-1" style={ { backgroundColor: bgAreaColor } }>
            <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{areaAbbreviations[area]}</Text>
          </View>
        )
    }
    return (
      <View key={area} className="rounded-full px-2 py-1" style={ { backgroundColor: bgAreaColor } }>
        <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{area}</Text>
      </View>
    )
  })

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
          className="flex flex-row justify-between items-center flex-1 rounded-lg p-3 overflow-hidden bg-light-100"
          style={animatedStyle}
      >
        <View className="flex flex-col items-start justify-center gap-y-[2px]">
          <Text numberOfLines={1} className={`text-xl font-bold ${textColor}`}>
              {`${subject.abbreviation} ${course.abbreviation}`}
          </Text>
          <Text className={`font-montserrat-semibold ${textColor} mb-[4px]`}>
              {course.name}
          </Text>
          <View className="flex flex-row justify-start items-center gap-x-[5px]">
              {areaDisplays}
          </View>
        </View>
        <View>
          <Text className={`font-montserrat-bold text-4xl ${textColor}`}>
              {course.units}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

export default CourseCard