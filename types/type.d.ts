export interface ScreenCodeProps {
    id: number
    name: string
    code: number
}

export interface ModalProps {
    children?: React.ReactNode;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}



export interface RewardCardProps {
    title: string;
    rewardName: string;
    reward_type: 'promo' | 'reward';
    unlock_points?: number | null; // Now allows null
    days_left?: number | null;     // Now allows null
    isLocked: boolean;
}

export interface UserProfileProps {
    id: number;
    name: string;
    phone_number: string;
    current_points: number;
    last_visit: string;
    member_since: string;
    membership_level: "New" | "Regular" | "VIP" | "VVIP";
    avatar_name: string;
}


export interface RecentVisit {
    id: number;
    customer_id: string; // Assuming customers.id is a uuid (string)
    phone_number: string;
    store_id: string;
    last_visit: string;
    total_visits?: number;
    current_points?: number;
    lifetime_points?: number;
    membership_level?: string;
    joined_date?: string;
    // Note: customer is returned as an array by Supabase joins
    customer: {
        name: string;
        avatar_name?: string;
        phone_number: string;
    }[];
}

export interface Customer {
    id: string;
    store_id: string;
    phone_number: string;
    name: string;
    avatar_name?: string;
    current_points?: number;
    lifetime_points?: number;
    total_visits?: number;
    last_visit?: string;
    membership_level?: string;
    is_active?: boolean;
    joined_date?: string;
}
