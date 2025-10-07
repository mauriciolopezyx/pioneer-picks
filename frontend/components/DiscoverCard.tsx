import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme } from "react-native";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  English: "book-outline",
  History: "time-outline",
  Math: "calculator-outline",
  Physics: "flask-outline"
};

const colorPalette = [
  "#E74C3C", // red
  "#9B59B6", // purple
  "#3498DB", // blue
  "#1ABC9C", // teal
  "#F39C12", // orange
  "#2ECC71", // green
];

type Subject = {
    name: string,
    id: number
}

const DiscoverCard = ({ item, index }: {item: Subject, index: number}) => {
  const colorScheme = useColorScheme();
  const bgColor = colorPalette[index % colorPalette.length];
  const iconName = iconMap[item.name] ?? "ellipse-outline";

  return (
    <Link href={{
        pathname: "/(tabs)/discover/[name]",
        params: { name: item.name },
    }} asChild>
      <TouchableOpacity
        className="flex-1 m-1 h-32 rounded-lg p-3 overflow-hidden"
        style={{ backgroundColor: bgColor }}
        activeOpacity={0.8}
      >
        {/* Title top-left */}
        <Text
          numberOfLines={2}
          className="text-xl text-white w-3/4"
        >
          {item.name}
        </Text>

        {/* Icon bottom-right, oversized & clipped */}
        <Ionicons
          name={iconName}
          size={100} // big enough to overflow
          color="rgba(255,255,255,0.7)"
          style={{
            position: "absolute",
            bottom: -15,
            right: -15,
          }}
        />
      </TouchableOpacity>
    </Link>
  );
};

export default DiscoverCard