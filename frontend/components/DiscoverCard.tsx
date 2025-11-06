import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, useColorScheme, Dimensions } from "react-native";
import { revolvingColorPalette, subjectColorMappings, subjectIconMappings } from "@/services/utils";
import { GestureWrapper } from "@/app/(tabs)/home";

type Subject = {
    name: string,
    id: number
}

const DiscoverCard = ({ item, index }: {item: Subject, index: number}) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const paletteKey = subjectColorMappings[item.name.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#fff";
  const iconName = subjectIconMappings[item.name] ?? "ellipse-outline";

  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 20 * 2 // px-5 on SafeAreaView = 20px each side
  const gap = 10 // gap between columns
  const cardWidth = (screenWidth - horizontalPadding - gap) / 2

  const handleSubmit = () => {
    router.navigate({
        pathname: "/(tabs)/discover/[id]",
        params: { id: item.id },
    })
  };

  return (
    <GestureWrapper className={`h-32 rounded-lg p-3 overflow-hidden w-[${cardWidth}px] ${index % 2 === 0 ? "mr-[10px]" : ""}`} backgroundColor={bgColor} onPress={handleSubmit}>
      <Text
        numberOfLines={2}
        className="font-montserrat-medium text-lg text-white w-3/4"
      >
        {item.name}
      </Text>
      
      <Ionicons
        name={iconName}
        size={80} // big enough to overflow
        color="rgba(255,255,255,0.7)"
        style={{
          position: "absolute",
          bottom: -15,
          right: -15,
        }}
      />
    </GestureWrapper>
  );
};

export default DiscoverCard