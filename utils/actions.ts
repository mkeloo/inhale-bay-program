import { supabase } from '@/utils/supabase';

export interface UserType {
    id: number;
    user_type_name: string;
    description: string;
}

// Fetch user types from Supabase
export const fetchUserTypes = async (): Promise<UserType[]> => {
    const { data, error } = await supabase.from('user_types').select('*');

    if (error) {
        console.error('Error fetching user types:', error);
        return [];
    }

    return data || [];
};