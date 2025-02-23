import { supabase } from '@/utils/supabase';

export interface UserType {
    id: number;
    user_type_name: string;
    description: string;
}

// ───────────────────────────────────────────────────────────
// Fetch Store Information from Supabase
// ───────────────────────────────────────────────────────────
export interface Store {
    id: string;
    store_name: string;
    store_code: string;
    address: string;
    city: string;
    state: string;
    country: string;
    phone_number: string;
    email: string;
    is_active: boolean;
}

export const fetchStores = async (): Promise<Store[]> => {
    const { data, error } = await supabase.from('inhale_bay_stores').select('*');

    if (error) {
        console.error('Error fetching stores:', error);
        return [];
    }

    return data || [];
};

// ───────────────────────────────────────────────────────────
// Fetch Store ID by Store Code
// ───────────────────────────────────────────────────────────

export const fetchStoreIdByCode = async (storeCode: string): Promise<string | null> => {
    const { data, error } = await supabase
        .from('inhale_bay_stores')
        .select('id')
        .eq('store_code', storeCode)
        .single();

    if (error) {
        console.error(`Error fetching store ID for store_code ${storeCode}:`, error);
        return null;
    }

    return data?.id || null;
};

// ───────────────────────────────────────────────────────────
// Fetch User Types from Supabase
// ───────────────────────────────────────────────────────────
export const fetchUserTypes = async (): Promise<UserType[]> => {
    const { data, error } = await supabase.from('user_types').select('*');

    if (error) {
        console.error('Error fetching user types:', error);
        return [];
    }

    return data || [];
};

// ───────────────────────────────────────────────────────────
// Fetch Rewards from Supabase
// ───────────────────────────────────────────────────────────
export interface Reward {
    id: number;
    store_id: string;
    title: string;
    reward_name: string;
    unlock_points?: number | null;
    reward_type: 'promo' | 'reward';
    days_left?: number | null;
}

// Fetch rewards from Supabase
export const fetchRewards = async (): Promise<Reward[]> => {
    const { data, error } = await supabase.from('rewards').select('*');

    if (error) {
        console.error('Error fetching rewards:', error);
        return [];
    }

    return data || [];
};

// ───────────────────────────────────────────────────────────
// Fetch Customer by Phone Number from Supabase
// ───────────────────────────────────────────────────────────

export const fetchCustomerByPhone = async (phoneNumber: string) => {
    const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('phone_number', phoneNumber)
        .maybeSingle(); // ✅ Prevents errors when no rows are found

    if (error) {
        console.error('Error fetching customer:', error);
        return null; // 🚀 Ensure function doesn't crash
    }

    return data; // ✅ Returns null if no customer is found, avoiding an error
};

// ───────────────────────────────────────────────────────────
// Insert New Customer into Supabase Customers Table
// ───────────────────────────────────────────────────────────

export interface Customer {
    store_id: string;
    phone_number: string;
    name: string;
    avatar_name?: string;
    current_points?: number;
    lifetime_points?: number;
    total_visits?: number;
    last_visit?: string;
    joined_date?: string;
    membership_level?: string;
    is_active?: boolean;
}


export const insertCustomer = async (customer: Pick<Customer, 'store_id' | 'phone_number' | 'name' | 'avatar_name'>): Promise<{ data: any; error: any }> => {
    const { data, error } = await supabase.from('customers').insert([
        {
            store_id: customer.store_id,
            phone_number: customer.phone_number,
            name: customer.name,
            avatar_name: customer.avatar_name,
            current_points: 0, // New customers start with 0 points
            lifetime_points: 0, // No accumulated points yet
            total_visits: 1, // First visit
            last_visit: new Date().toISOString(), // Current timestamp
            joined_date: new Date().toISOString().split('T')[0], // Store only the date
            membership_level: 'new', // Default membership level
            is_active: true, // All new customers are active by default
        },
    ]);

    if (error) {
        console.error('Error inserting customer:', error);
    }

    return { data, error };
};