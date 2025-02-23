import { create } from 'zustand';

export interface CustomerData {
    store_id: string;
    phone_number: string;
    name: string;
    avatar_name?: string;
}

interface CustomerState extends CustomerData {
    setCustomerData: (data: Partial<CustomerData>) => void;
    resetCustomerData: () => void;
}

export const useCustomerStore = create<CustomerState>((set) => ({
    store_id: '',
    phone_number: '',
    name: '',
    avatar_name: '',
    setCustomerData: (data: Partial<CustomerData>) =>
        set((state) => ({ ...state, ...data })),
    resetCustomerData: () =>
        set({ store_id: '', phone_number: '', name: '', avatar_name: '' }),
}));