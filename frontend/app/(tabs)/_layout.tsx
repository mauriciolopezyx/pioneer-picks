
import { Tabs } from 'expo-router'
import React from 'react'
import { Text, View, useColorScheme } from 'react-native'
import { Ionicons } from '@expo/vector-icons';

const TabSection = ({focused, iconName, title, colorScheme}: any) => {

    const color = focused ? "#d50032" : colorScheme === "dark" ? "#aaa" : "black"
    
    return (
        <View className="w-full min-w-[70px] flex-1 gap-2 justify-center items-center dark:bg-black">
            <Ionicons name={iconName} size={20} color={color} />
            <Text 
                numberOfLines={1}
                className={
                    `text-[12px] font-semibold
                    ${focused ? "text-primary" : colorScheme === "dark" ? "text-light-100" : "text-black"}`
                }
            >
                {title}
            </Text>
        </View>
    )
}
const _layout = () => {
    const colorScheme = useColorScheme()
    return (
        <Tabs
            screenOptions={{
            headerShown: true,
            tabBarShowLabel: false,
            tabBarStyle: {
                paddingTop: 10,
                paddingBottom: 10,
                paddingHorizontal: 10,
                borderColor: colorScheme === "dark" ? "#000" : "#fff",
                backgroundColor: colorScheme === "dark" ? "#000" : "#fff"
            },
            tabBarItemStyle: {
                display: "flex",
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                minWidth: 70
            },
            headerStyle: {
                backgroundColor: "#000"
            },
            headerTitleStyle: {
                color: "#fff",
                fontSize: 24
            },
            headerTitleAlign: "left"
        }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({focused}) => (
                        <TabSection
                            focused={focused}
                            iconName="home-sharp"
                            title="Home"
                            colorScheme={colorScheme}
                        />
                    ),
                    headerTitle: "Home",
                    headerTitleStyle: {
                        fontFamily: "Montserrat_700Bold",
                        color: "#fff",
                        fontSize: 28
                    }
                }}
            />
            <Tabs.Screen
                name="discover"
                options={{
                    title: "Discover",
                    tabBarIcon: ({focused}) => (
                        <TabSection
                            focused={focused}
                            iconName="search"
                            title="Discover"
                            colorScheme={colorScheme}
                        />
                    ),
                    headerTitle: "Discover",
                    headerTitleStyle: {
                        fontFamily: "Montserrat_700Bold",
                        color: "#fff",
                        fontSize: 28
                    }
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: "Account",
                    tabBarIcon: ({focused}) => (
                        <TabSection
                            focused={focused}
                            iconName="person"
                            title="Account"
                            colorScheme={colorScheme}
                        />
                    ),
                    headerTitle: "Account",
                    headerTitleStyle: {
                        fontFamily: "Montserrat_700Bold",
                        color: "#fff",
                        fontSize: 28
                    }
                }}
            />
        </Tabs>
    )
}

export default _layout