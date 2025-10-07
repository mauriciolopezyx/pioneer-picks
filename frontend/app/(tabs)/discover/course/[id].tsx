import { SafeAreaView, Text, ScrollView, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import SectionCard from '@/components/SectionCard';

const Course = () => {

    const { id:courseId, subject } = useLocalSearchParams();
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

    return (
        <SafeAreaView className="flex-1">
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                minHeight: "100%", paddingBottom: 10
                }}
            >
                <Text className="font-extrabold text-4xl mb-2">{courseId} ({course.units} Units)</Text>

                <Text className="font-bold text-2xl">Description</Text>
                <Text className="mb-4">{course?.description}</Text>

                <Text className="font-bold text-2xl">Areas</Text>
                <Text className="mb-4">{course?.attributes.join(", ")}</Text>

                <Text className="font-bold text-2xl mb-2">Sections</Text>
                <FlatList
                    data={course.sections}
                    renderItem={(item) => (
                        <SectionCard {...item} course={course?.courseId} />
                    )}
                    keyExtractor={(item) => item.sectionId.toString() ?? crypto.randomUUID()}
                    numColumns={1}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    scrollEnabled={false}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Course