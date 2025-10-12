import { StyleSheet, Text, ScrollView, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import data from "@/assets/english.json"
import CourseCard from '@/components/CourseCard'

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Courses = () => {
    const {name} = useLocalSearchParams()

    const chosenData = name === "All" ? data.courses : data.courses

    return (
    <SafeAreaView className="flex-1">
        <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%", paddingBottom: 10
        }}
      >
        <Text className="font-montserrat-extrabold text-4xl mb-2">{name}</Text>
        <Text className="font-montserrat mb-8">{data.subject.description}</Text>
        <Text className="font-montserrat-bold text-2xl mb-2">Courses</Text>
        <FlatList
            data={chosenData}
            renderItem={(item) => (
                <CourseCard {...item} subject={data.subject.name} />
            )}
            keyExtractor={(item) => item.courseId.toString() ?? crypto.randomUUID()}
            numColumns={1}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
    )
}

export default Courses

const styles = StyleSheet.create({})