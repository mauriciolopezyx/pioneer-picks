import { Text, ScrollView, FlatList, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import ProfessorCard from '@/components/ProfessorCard';
import { Ionicons } from '@expo/vector-icons';
import { areas, revolvingColorPalette, subjectColorMappings, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Course = () => {

    const router = useRouter()
    const { id:courseId, subject }: {id: string, subject: string} = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        if (subject) {
            navigation.setOptions({
                headerBackTitle: subject,
            });
        }
    }, [subject]);

    const course = data.courses.find(element => element.courseId === courseId)

    if (!course) {
        return (
            <View></View>
        )
    }

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        router.navigate({
            pathname: "/(modals)/areas"
        })
    }

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
        })
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value
    }));

    const seen = new Set()
    const areaDisplays = course.areas.map((area) => {
        if (seen.has(area)) return null
        if (areaAbbreviations[area] && seen.has(areaAbbreviations[area])) return null

        seen.add(area)
        const parentArea = findAreaParentKey(areas, area)
        const bgAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].primary : "transparent"
        const textAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].secondary : "text-white"

        if (areaAbbreviations[area]) {
            seen.add(areaAbbreviations[area])
            return (
                <View key={areaAbbreviations[area]} className="rounded-full px-4 py-1" style={ { backgroundColor: bgAreaColor } }>
                <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{areaAbbreviations[area]}</Text>
                </View>
            )
        }
        return (
            <View key={area} className="rounded-full px-4 py-1" style={ { backgroundColor: bgAreaColor } }>
            <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{area}</Text>
            </View>
        )
    })

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    minHeight: "100%", paddingBottom: 10
                }}
            >
                <View className="flex flex-row justify-between items-center">
                    <Text className="font-montserrat-extrabold text-4xl mb-2">{courseId}</Text>
                    <View className="flex items-center justify-center mb-2 w-10 aspect-square bg-black p-1 rounded-full">
                        <Text className="font-montserrat-extrabold text-lg text-white">{course.units}</Text>
                    </View>
                </View>

                <Text className="font-montserrat-bold text-2xl mb-2">Description</Text>
                <Text className="font-montserrat mb-4">{course?.description}</Text>

                <View className="flex flex-row justify-between items-center gap-x-2 mb-2">
                    <Text className="font-montserrat-bold text-2xl">Areas</Text>
                    <GestureDetector gesture={tap}>
                         <Animated.View className="flex items-center justify-center w-[30px] h-[30px] rounded-full bg-black" style={animatedStyle}>
                            <Ionicons name="information-outline" size={20} color="white" />
                         </Animated.View>
                    </GestureDetector>
                </View>

                <View className="flex flex-row gap-2 w-full mb-4">
                    {areaDisplays}
                </View>

                <Text className="font-montserrat-bold text-2xl mb-2">Professors</Text>
                <FlatList
                    data={course.professors}
                    renderItem={(item) => (
                        <ProfessorCard {...item} course={course?.courseId} subject={subject} />
                    )}
                    keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
                    numColumns={1}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    scrollEnabled={false}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Course