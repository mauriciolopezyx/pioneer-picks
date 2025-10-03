import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";

type Section = {
    sectionId: string,
    professor: string,
    schedule: string,
    location: string
}

const SectionCard = ({ item, index, course }: {item: Section, index: number, course: string}) => {
  const colorScheme = useColorScheme();

  return (
    <Link href={{
        pathname: "/(tabs)/discover/course/section/[id]",
        params: { id: item.sectionId, course },
    }} asChild>
      <TouchableOpacity
        className="flex flex-row justify-between items-center flex-1 h-24 rounded-lg p-3 overflow-hidden bg-light-100"
        activeOpacity={0.8}
      >
        <View>
            <Text numberOfLines={1} className="text-xl font-semibold">
                {item.sectionId}
            </Text>
            <Text className="font-medium">
                {item.professor}
            </Text>
            <Text className="italic">
                {item.schedule}
            </Text>
        </View>
        <View>
            <Text className="font-bold text-2xl">
                {item.location}
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

export default SectionCard