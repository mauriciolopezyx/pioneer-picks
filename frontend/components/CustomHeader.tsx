import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Text, useColorScheme, Pressable, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from "@react-navigation/native";

export default function CustomHeader({ value, onChangeText, placeholder="Search Pioneer Picks..."}: any) {
  const route = useRoute();
  const colorScheme = useColorScheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const titles: Record<string, string> = {
    index: "Home",
    account: "Account",
    all: "Discover"
  };

  const currentTitle = titles[route.name] ?? route.name;

  return (
    <View className={`flex-row justify-between items-center py-2 w-full ${route.name != "all" && "px-[8px]"}`}>
      {/* Title */}
      {true && (
        <Text
          className={`text-3xl w-1/2 font-montserrat-bold ${colorScheme === 'dark' ? 'text-white' : 'text-black'}`}
        >
          {!isFocused ? currentTitle : ""}
        </Text>
      )}

      {/* Pressable icon to focus the search */}
      {!isFocused && (
        <Pressable
          onPress={() => {
            setIsFocused(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
        >
          <Ionicons name="search" size={22} color={colorScheme === 'dark' ? '#d50032' : '#d50032'} />
        </Pressable>
      )}

      {/* Animated search input */}
      {isFocused && (
        <Animated.View
          className="flex-1 flex-row items-center justify-between gap-4"
        >
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colorScheme === 'dark' ? '#fff' : '#fff'}
            onBlur={() => setIsFocused(false)}
            className={`text-white bg-light-200 flex-1 px-4 py-2 rounded-full text-lg align-middle font-montserrat-medium`}
            returnKeyType="search"
            autoCorrect={false}
            style={{
              paddingVertical: Platform.OS === "ios" ? 6 : 4,  // tweak per platform
              lineHeight: 20, // match to fontSize (e.g. 16 → ~20 lineHeight)
              includeFontPadding: false, // Android fix
              textAlignVertical: "center", // Android fix
            }}
          />
          <Pressable
            onPress={() => {
              setIsFocused(false);
              inputRef.current?.blur();
            }}
          >
            <Ionicons name="close" size={32} color={colorScheme === 'dark' ? '#d50032' : '#d50032'} />
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}