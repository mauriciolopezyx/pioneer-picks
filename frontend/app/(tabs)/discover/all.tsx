import { StyleSheet, Text, View, FlatList } from 'react-native'
import data from "@/assets/data.json"
import DiscoverCard from '@/components/DiscoverCard'

const discover = () => {
  return (
    <View className="flex-1 p-5">
      <FlatList
        data={data.subjects}
        renderItem={(item) => (
          <DiscoverCard {...item} />
        )}
        keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: 10
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        scrollEnabled={false}
      />
    </View>
  )
}

export default discover