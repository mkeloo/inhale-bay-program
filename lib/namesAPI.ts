// namesAPI.ts

// URL to your CSV file hosted on GitHub
const CSV_URL = 'https://raw.githubusercontent.com/mkeloo/names-data/main/names.csv';

// Define the shape of a name entry
export interface NameEntry {
    id: number;
    name: string;
}

// In-memory cache for names data so we fetch only once per session
let namesCache: NameEntry[] = [];

/**
 * Fetches and parses the CSV data.
 * Returns an array of NameEntry objects.
 */
export async function fetchNamesData(): Promise<NameEntry[]> {
    // Return cached data if already fetched
    if (namesCache.length > 0) {
        return namesCache;
    }

    const response = await fetch(CSV_URL);
    if (!response.ok) {
        throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
    }

    const csvText = await response.text();
    namesCache = parseCSV(csvText);
    return namesCache;
}

/**
 * Parses CSV text into an array of NameEntry objects.
 * Assumes CSV format:
 *   id,name
 *   1,"Aaron"
 *   2,"Abby"
 *   ...
 */
function parseCSV(csvText: string): NameEntry[] {
    // Split CSV into lines, trim whitespace, and filter out empty lines.
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);

    // Remove header row (e.g., "id,name")
    lines.shift();

    const result: NameEntry[] = [];

    // Process each line
    for (const line of lines) {
        // Split on the first comma only, to accommodate names that might include commas.
        const firstCommaIndex = line.indexOf(',');
        if (firstCommaIndex === -1) continue;

        const idStr = line.substring(0, firstCommaIndex).trim();
        let nameStr = line.substring(firstCommaIndex + 1).trim();

        // Remove surrounding quotes from the name if present.
        if (nameStr.startsWith('"') && nameStr.endsWith('"')) {
            nameStr = nameStr.substring(1, nameStr.length - 1);
        }

        const id = parseInt(idStr, 10);
        if (!isNaN(id)) {
            result.push({ id, name: nameStr });
        }
    }
    return result;
}

/**
 * Searches for names that start with the given query (case-insensitive).
 * Deduplicates results so that each name appears only once.
 * Returns up to 5 matching NameEntry objects.
 * 
 * @param query - The search term.
 */
export async function searchNames(query: string): Promise<NameEntry[]> {
    if (!query.trim()) {
        return [];
    }

    // Ensure we have the data
    const data = await fetchNamesData();
    const lowerQuery = query.toLowerCase();

    // Filter entries that start with the search query
    const filtered = data.filter(entry => entry.name.toLowerCase().startsWith(lowerQuery));

    // Deduplicate names using a Map
    const uniqueNames = new Map<string, NameEntry>();
    for (const entry of filtered) {
        if (!uniqueNames.has(entry.name)) {
            uniqueNames.set(entry.name, entry);
        }
    }

    // Return the first 5 unique entries
    return Array.from(uniqueNames.values()).slice(0, 5);
}