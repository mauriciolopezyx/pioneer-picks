import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "recent_searches";
const MAX_ITEMS = 10;

export type RecentSearch = {
  id: string,
  name: string,
  category: number,
  subject?: string,
  abbreviation?: string,
  subjectAbbreviation?: string
}

export async function addRecentSearch(search: RecentSearch) {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    let list: RecentSearch[] = json ? JSON.parse(json) : [];

    // remove existing if already in list
    list = list.filter(item => item.id !== search.id || item.category !== search.category);

    // add to front
    list.unshift(search);

    // cap size
    if (list.length > MAX_ITEMS) {
      list = list.slice(0, MAX_ITEMS);
    }

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error("Error saving recent search", err);
  }
}

export async function getRecentSearches(): Promise<RecentSearch[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  } catch (err) {
    console.error("Error loading recent searches", err);
    return [];
  }
}

export async function clearRecentSearches() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
