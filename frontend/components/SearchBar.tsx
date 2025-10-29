import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from 'react'
import { Pressable, TextInput, View, useColorScheme } from 'react-native'

type Props = {
    placeholder: string,
    onPress?: () => void,
    value?: string,
    onChangeText?: (text: string) => void,
    onSubmit?: () => void,
    disabled?: boolean
}

const SearchBar = ({
  placeholder, 
  onPress, 
  value, 
  onChangeText,
  onSubmit,
  disabled
}: Props) => {
  const textInputRef = useRef<TextInput>(null)
  const [isFocused, setIsFocused] = useState(false)

  const colorScheme = useColorScheme()

  const handleContainerPress = () => {
    textInputRef.current?.focus()
    onPress?.()
  }

  const handleSubmit = () => {
    textInputRef.current?.blur()
    onSubmit?.()
  }

  return (
    <Pressable 
      onPress={handleContainerPress}
      className={`flex-1 flex flex-row items-center bg-gray-200 dark:bg-gray-700 rounded-full px-4 py-3 overflow-hidden
      }`}
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.95 : 1,
          transform: [{ scale: pressed ? 0.99 : 1 }]
        }
      ]}
    >
      <View pointerEvents="none">
        <Ionicons name="search-outline" size={20} color={colorScheme === "dark" ? "#aaa" : "#545a6d"} />
      </View>
      <TextInput
        ref={textInputRef}
        placeholder={placeholder}
        placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#545a6d"}
        onChangeText={onChangeText}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={handleSubmit}
        className="flex-1 font-montserrat ml-3 dark:text-white"
        autoCorrect={true}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never" // We'll use custom clear button
        autoFocus={false}
        editable={!disabled}
      />
    </Pressable>
  )
}

// const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
//   return (
//     <View className="flex flex-row items-center bg-dark-200 rounded-full px-5 py-4">
//       <Image source={icons.search} className="size-5" resizeMode="contain" tintColor="#ab8ff" />
//       <TextInput
//         onPress={onPress}
//         placeholder={placeholder}
//         placeholderTextColor="#a8b5db"
//         onChangeText={onChangeText}
//         value={value}
//         className="flex-1 ml-2 text-white bg-gray-100"
//       />
//     </View>
//   )
// }

export default SearchBar 