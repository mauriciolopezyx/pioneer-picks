import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View, useColorScheme } from "react-native";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";
import { GestureWrapper } from "@/app/(tabs)/home";

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

  const handleSubmit = () => {
    router.navigate({
      pathname: "/(tabs)/discover/professors/[id]",
      params: { id: professor.id, courseId: course.id, subjectName: subject.name, subjectAbbreviation: subject.abbreviation, courseAbbreviation: course.abbreviation, getAll: "false" },
    })
  };

  return (
    <GestureWrapper className="flex flex-row justify-between items-center flex-1 h-24 rounded-lg p-3 overflow-hidden" backgroundColor={bgColor} onPress={handleSubmit}>
      <View>
        <Text numberOfLines={1} className={`text-xl font-montserrat-bold ${textColor}`}>
          {professor.name}
        </Text>
        <Text className={`font-montserrat-semibold ${textColor}`}>
          {`${professor.reviewCount} Review${professor.reviewCount == 1 ? "" : "s"}`}
        </Text>
      </View>
      <View>
        <Ionicons name="chevron-forward-outline" size={30} color="white" />
      </View>
    </GestureWrapper>
  );
};

export default ProfessorCard