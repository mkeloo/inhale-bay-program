import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing names
const STORAGE_KEY = 'stored_names';

// List of common first names (Can be extended)
import { DEFAULT_NAMES } from '@/lib/names';

// Initialize storage with common names
export const initStorage = async () => {
    // console.log('DEFAULT_NAMES in initStorage:', DEFAULT_NAMES);

    try {
        const existingNames = await AsyncStorage.getItem(STORAGE_KEY);

        // If nothing is stored, or if it's an empty array, store the defaults
        if (existingNames) {
            const parsed = JSON.parse(existingNames);
            // If it's not an array or is empty, store default
            if (!Array.isArray(parsed) || parsed.length === 0) {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NAMES));
            }
        } else {
            // no item at all, so store default
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NAMES));
        }

    } catch (error) {
        console.error('Error initializing storage:', error);
    }
};
// Insert a name into AsyncStorage
export const insertName = async (name: string) => {
    try {
        const existingNames = await AsyncStorage.getItem(STORAGE_KEY);
        const names = existingNames ? JSON.parse(existingNames) : [];

        if (!names.includes(name)) {
            names.push(name);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(names));
        }
    } catch (error) {
        console.error('Error inserting name:', error);
    }
};

// Search for names based on input
export const searchNames = async (query: string, callback: (results: string[]) => void) => {
    try {
        const storedData = await AsyncStorage.getItem(STORAGE_KEY);
        let allNames = storedData ? JSON.parse(storedData) : [];

        // Remove duplicates
        allNames = [...new Set(allNames)];

        // Optionally show all names or a subset when query is empty
        const filteredNames = query
            ? allNames.filter((name: string) => name.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5)
            : allNames.slice(0, 7);

        callback(filteredNames);
    } catch (error) {
        console.error('Error searching names:', error);
        callback([]);
    }
};

// Reset AsyncStorage and reload with default names
export const resetStorage = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY); // Clear existing data
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_NAMES)); // Store updated names
        console.log('AsyncStorage reset successful');
    } catch (error) {
        console.error('Error resetting storage:', error);
    }
};