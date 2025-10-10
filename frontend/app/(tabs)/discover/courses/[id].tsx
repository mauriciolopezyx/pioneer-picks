import { Text, ScrollView, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import ProfessorCard from '@/components/ProfessorCard';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Course = () => {

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

    return (
        <SafeAreaView className="flex-1 pt-[40px]">
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

                <Text className="font-montserrat-bold text-2xl mb-2">Areas</Text>
                <View className="flex flex-row gap-5 w-full mb-4">
                    {course?.areas.map(attribute => {
                        return (
                            <View key={attribute} className="flex justify-center items-center px-3 border-[1px] border-black rounded-full">
                                <Text className="font-montserrat-bold">{attribute}</Text>
                            </View>
                        )
                    })}
                </View>

                <Text className="font-montserrat-bold text-2xl mb-2">Professors</Text>
                <FlatList
                    data={course.professors}
                    renderItem={(item) => (
                        //<SectionCard {...item} course={course?.courseId} subject={subject} />
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