import { useRouter } from "expo-router";
import React from "react";
import { Text, View, useColorScheme } from "react-native";
import { areas, revolvingColorPalette, subjectColorMappings, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";
import { GestureWrapper } from "@/app/(tabs)/home";

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

  const handleSubmit = () => {
    router.navigate({
        pathname: "/(tabs)/discover/courses/[id]",
        params: { id: course.id, subjectName: subject.name, subjectAbbreviation: subject.abbreviation },
    })
  };

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
    <GestureWrapper className="flex flex-row justify-between items-center flex-1 rounded-lg p-3 overflow-hidden" backgroundColor={bgColor} onPress={handleSubmit}>
      <View className="flex flex-col items-start justify-center gap-y-[2px]">
        <Text numberOfLines={1} className={`text-xl font-montserrat-bold ${textColor}`}>
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
    </GestureWrapper>
  );
};

export default CourseCard