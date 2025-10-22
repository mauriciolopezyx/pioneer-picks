import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View, useColorScheme, Dimensions } from "react-native";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: "globe-outline",
  "Biological Sciences": "flask-outline",
  "Chemistry": "flask-outline",
  "Civil Engineering": "pencil-outline",
  "Computer Engineering": "server-outline",
  "Criminal Justice": "search-outline",
  "Economics": "trending-up-outline",
  "Engineering": "pencil-outline",
  "Ethnic Studies": "search-outline",
  "Finance": "cash-outline",
  "Geography": "earth-outline",
  "History": "hourglass-outline",
  "Kinesiology": "body-outline",
  "Mathematics": "calculator-outline",
  "Nursing": "medkit-outline",
  "Psychology": "man-outline",
  "Public Health": "medkit-outline",
  "Statistics": "stats-chart-outline",
  "Teacher Education": "chatbubbles-outline",
  English: "book-outline",
  Math: "calculator-outline",
  Physics: "flask-outline",
  "Computer Science": "laptop-outline"
};

type Subject = {
    name: string,
    id: number
}

const DiscoverCard = ({ item, index }: {item: Subject, index: number}) => {
  const router = useRouter()
  const colorScheme = useColorScheme();
  const paletteKey = subjectColorMappings[item.name.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#fff";
  const iconName = iconMap[item.name] ?? "ellipse-outline";

  const screenWidth = Dimensions.get('window').width
  const horizontalPadding = 20 * 2 // px-5 on SafeAreaView = 20px each side
  const gap = 10 // gap between columns
  const cardWidth = (screenWidth - horizontalPadding - gap) / 2

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
    router.navigate({
        pathname: "/(tabs)/discover/[id]",
        params: { id: item.id },
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
          className="h-32 rounded-lg p-3 overflow-hidden"
          style={[animatedStyle, {width: cardWidth}]}
      >
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
      </Animated.View>
    </GestureDetector>
  );
};

export default DiscoverCard