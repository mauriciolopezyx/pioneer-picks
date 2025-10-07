import { StyleSheet, Text, SafeAreaView, ScrollView, FlatList, View } from 'react-native'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import data from "@/assets/english.json"
import CourseCard from '@/components/CourseCard'

const Courses = () => {
    const {name} = useLocalSearchParams()

    return (
    <SafeAreaView className="flex-1">
        <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%", paddingBottom: 10
        }}
      >
        <Text className="font-extrabold text-4xl mb-2">{name}</Text>
        <Text className=" mb-8">{data.subject.description}</Text>
        <Text className="font-bold text-2xl mb-2">Courses</Text>
        <FlatList
            data={data.courses}
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