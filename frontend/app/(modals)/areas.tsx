import { ScrollView, View, Text } from 'react-native'
import React from 'react'
import { areas, areaAbbreviations, areaColorMappings, revolvingColorPalette } from '@/services/utils'

const Areas = () => {

    return (
        <ScrollView className="px-5 pt-5">
            <Text className="font-montserrat-bold font-bold text-2xl mb-4 mx-auto">Areas</Text>
            <View className="border-t-[1px] mb-4"></View>
            <RecursiveArea data={areas} />
            <View className="h-[50px]"></View>
        </ScrollView>
    )
}

const RecursiveArea = ({ data, level = 0, previousColor = "transparent" }: any) => {

    const seen = new Set()

    return (
        <View>
            {Object.entries(data).map(([key, value]: [string, unknown]) => {

            const isObject = typeof value === "object" && value !== null

            if (isObject) {

                const bgColor = areaColorMappings[key.toLowerCase()] ? revolvingColorPalette[areaColorMappings[key.toLowerCase()]].primary : "transparent"

                return (
                    <View key={key} className="flex flex-col justify-start items-start gap-y-[5px]">
                        <View
                            className="flex flex-row justify-start items-center"
                        >
                            <View
                                style={{
                                    backgroundColor: bgColor
                                }}
                                className={level === 0 ? "mt-4 mb-4" : "px-4 py-2 rounded-full"}
                            >
                                <Text className={`${level === 0 ? "font-montserrat-extrabold text-2xl" : "font-montserrat-bold text-sm"} ${areaColorMappings[key.toLowerCase()] && revolvingColorPalette[areaColorMappings[key.toLowerCase()]].secondary}`}>{key}</Text>
                            </View>
                        </View>
                        <RecursiveArea data={value} level={level + 1} previousColor={bgColor} />
                    </View>
                )
            } else {
                if (seen.has(key)) return null
                if (areaAbbreviations[key] && seen.has(areaAbbreviations[key])) return null
                
                seen.add(key)
                if (areaAbbreviations[key]) {
                    seen.add(areaAbbreviations[key])
                }

                return (
                    <View key={key} className="flex flex-row justify-start items-center mb-[3px] pl-[25px] gap-x-[5px]">
                        <View
                            style={{
                                backgroundColor: previousColor
                            }}
                            className="flex flex-row justify-center items-center px-2 py-1 rounded-full"
                        >
                            <Text className="font-montserrat-semibold text-white">{areaAbbreviations[key] ? areaAbbreviations[key] : key}</Text>
                        </View>
                        <Text className="font-montserrat-medium text-xs">{value as string}</Text>
                    </View>
                )
            }
            })}
        </View>
    )
}

export default Areas