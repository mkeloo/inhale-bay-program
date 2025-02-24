import { create } from 'zustand';

export interface CustomerData {
    store_id: string;
    phone_number: string;
    name: string;
    avatar_name?: string;

    // Additional fields you might want to store:
    current_points?: number;
    lifetime_points?: number;
    total_visits?: number;
    last_visit?: string;
    membership_level?: string;
    is_active?: boolean;
    joined_date?: string;
}

interface CustomerState extends CustomerData {
    setCustomerData: (data: Partial<CustomerData>) => void;
    resetCustomerData: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
    // Original fields
    store_id: '',
    phone_number: '',
    name: '',
    avatar_name: '',

    // Additional fields with defaults
    current_points: 0,
    lifetime_points: 0,
    total_visits: 0,
    last_visit: '',
    membership_level: '',
    is_active: false,
    joined_date: '',

    // Update partial or full customer data
    setCustomerData: (data: Partial<CustomerData>) =>
        set((state) => ({ ...state, ...data })),

    // Reset everything back to defaults
    resetCustomerData: () =>
        set({
            store_id: '',
            phone_number: '',
            name: '',
            avatar_name: '',
            current_points: 0,
            lifetime_points: 0,
            total_visits: 0,
            last_visit: '',
            membership_level: '',
            is_active: false,
            joined_date: '',
        }),
}));