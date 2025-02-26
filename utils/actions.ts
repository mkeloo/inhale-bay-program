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
    const { data, error } = await supabase
        .from('rewards')
        .select('*')
        .or('reward_type.eq.reward,reward_type.eq.promo.and(active.eq.true)');

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



// ───────────────────────────────────────────────────────────
// Update Customer Information into Supabase Customers Table
// ───────────────────────────────────────────────────────────


// ───────────────────────────────────────────────────────────
// Handle Customer Login or Return Visit
// ───────────────────────────────────────────────────────────
// export const handleCustomerLogin = async (
//     store_id: string,
//     phone_number: string,
//     name: string,
//     avatar_name?: string
// ) => {
//     // 1. Check if customer exists
//     const { data: existingCustomer, error: fetchError } = await supabase
//         .from('customers')
//         .select('*')
//         .eq('phone_number', phone_number)
//         .maybeSingle();

//     if (fetchError && fetchError.code !== 'PGRST116') {
//         // PGRST116 = "No rows found" → This is fine for new customers
//         console.error('Error fetching customer:', fetchError);
//         return null;
//     }

//     // 2. If not found, insert a new record
//     if (!existingCustomer) {
//         const { data: inserted, error: insertError } = await supabase
//             .from('customers')
//             .insert({
//                 store_id,
//                 phone_number,
//                 name,
//                 avatar_name,
//                 current_points: 0,
//                 lifetime_points: 0,
//                 total_visits: 1,
//                 last_visit: new Date().toISOString(),
//                 joined_date: new Date().toISOString().split('T')[0],
//                 membership_level: 'new',
//                 is_active: true,
//             })
//             .single();

//         if (insertError) {
//             console.error('Insert error:', insertError);
//             return null;
//         }

//         return inserted;
//     }
//     // 3. If found, update the existing record
//     else {
//         const { data: updated, error: updateError } = await supabase
//             .from('customers')
//             .update({
//                 last_visit: new Date().toISOString(),
//                 is_active: true,
//                 total_visits: (existingCustomer.total_visits ?? 0) + 1,
//             })
//             .eq('id', existingCustomer.id)
//             .single();

//         if (updateError) {
//             console.error('Update error:', updateError);
//             return null;
//         }

//         return updated;
//     }
// };

export const handleCustomerLogin = async (
    store_id: string,
    phone_number: string,
    name: string,
    avatar_name?: string
) => {
    // 🔍 Check if customer already exists
    const { data: existingCustomer, error: fetchError } = await supabase
        .from('customers')
        .select('*')
        .eq('phone_number', phone_number)
        .maybeSingle(); // Ensure single record lookup

    if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = "No rows found" → This is fine for new customers
        console.error('Error fetching customer:', fetchError);
        return null;
    }

    if (existingCustomer) {
        // ✅ Customer exists → Update their visit information
        const { data: updated, error: updateError } = await supabase
            .from('customers')
            .update({
                last_visit: new Date().toISOString(),
                total_visits: (existingCustomer.total_visits ?? 0) + 1, // Increment visits
                is_active: true, // Reactivate customer
                store_id, // Update store_id if needed
                name, // Ensure name is updated
                avatar_name, // Ensure avatar is stored
            })
            .eq('phone_number', phone_number) // Match by phone number
            .select()
            .single();

        if (updateError) {
            console.error('Update error:', updateError);
            return null;
        }

        return updated;
    } else {
        // 🔹 New Customer → Insert into database
        const { data: inserted, error: insertError } = await supabase
            .from('customers')
            .insert([
                {
                    store_id,
                    phone_number,
                    name,
                    avatar_name,
                    current_points: 0,
                    lifetime_points: 0,
                    total_visits: 1,
                    last_visit: new Date().toISOString(),
                    joined_date: new Date().toISOString().split('T')[0],
                    membership_level: 'new',
                    is_active: true,
                },
            ])
            .select()
            .maybeSingle();

        if (insertError) {
            // console.error('Insert error:', insertError);
            return null;
        }

        return inserted;
    }
};


// ───────────────────────────────────────────────────────────
// Update Customer Points to show customer's current points
// ───────────────────────────────────────────────────────────
export const updateCustomerPoints = async (
    phone_number: string,
    totalPoints: number,
    earnedPoints: number
) => {
    // Fetch current customer
    const customer = await fetchCustomerByPhone(phone_number);
    if (!customer) {
        console.error("Customer not found for phone number:", phone_number);
        return null;
    }

    // Calculate new lifetime points
    const newLifetimePoints = (customer.lifetime_points || 0) + earnedPoints;

    // Update record and SELECT the full row
    const { data, error } = await supabase
        .from("customers")
        .update({
            current_points: totalPoints,
            lifetime_points: newLifetimePoints,
        })
        .eq("phone_number", phone_number)
        .select("*") // IMPORTANT: ensures store_id, id, etc. come back
        .single();   // returns an object instead of an array

    if (error) {
        console.error("Error updating customer points:", error);
        return null;
    }

    return data; // This will be a single customer object
};


// ───────────────────────────────────────────────────────────
// Insert or Update Recent Customer Visit (Stack of 8)
// ───────────────────────────────────────────────────────────

export const logRecentVisit = async (
    customer_id: string,
    phone_number: string,
    store_id: string
) => {
    const { data, error } = await supabase
        .from('recent_visits')
        .upsert({
            customer_id,
            phone_number,
            store_id,
            last_visit: new Date().toISOString(),
        }, { onConflict: 'customer_id' })
        .select();
    if (error) {
        console.error('Error logging recent visit:', error);
    }
    return data;
};

// ───────────────────────────────────────────────────────────
// Fetch Customer information using customer.id
// ───────────────────────────────────────────────────────────

export const fetchCustomerById = async (
    customerId: string
): Promise<Customer | null> => {
    const { data, error } = await supabase
        .from('customers')
        .select(`
            id,
            store_id,
            phone_number,
            name,
            avatar_name,
            current_points,
            lifetime_points,
            total_visits,
            last_visit,
            membership_level,
            is_active,
            joined_date
        `)
        .eq('id', customerId)
        .maybeSingle();
    if (error) {
        console.error("Error fetching customer by ID:", error);
        return null;
    }
    return data;
};


// ───────────────────────────────────────────────────────────
// Logging Customer Transactions
// ───────────────────────────────────────────────────────────

export const logCustomerTransaction = async (
    store_id: string,
    customer_id: string,
    transaction_type: 'signup' | 'visit' | 'redeem_reward',
    points_changed: number,
    net_points: number,
    reward_id?: number
) => {
    const { data, error } = await supabase
        .from('customer_transactions')
        .insert([
            {
                store_id,
                customer_id,
                transaction_type,
                points_changed,
                net_points,
                reward_id: reward_id || null,
            },
        ])
        .select();

    if (error) {
        console.error("Error logging customer transaction:", error);
        return null;
    }
    return data;
};