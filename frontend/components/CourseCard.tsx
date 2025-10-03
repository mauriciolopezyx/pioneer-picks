import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";

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
  const colorScheme = useColorScheme();

  return (
    <Link href={{
        pathname: "/(tabs)/discover/course/[id]",
        params: { id: item.courseId, subject },
    }} asChild>
      <TouchableOpacity
        className="flex flex-row justify-between items-center flex-1 h-24 rounded-lg p-3 overflow-hidden bg-light-100"
        activeOpacity={0.8}
      >
        <View>
            <Text numberOfLines={1} className="text-xl font-semibold">
                {item.courseId}
            </Text>
            <Text className="font-medium">
                {item.fullName}
            </Text>
            <Text className="italic">
                {item.attributes.join(", ")}
            </Text>
        </View>
        <View>
            <Text className="font-bold text-4xl">
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
      </TouchableOpacity>
    </Link>
  );
};

export default CourseCard