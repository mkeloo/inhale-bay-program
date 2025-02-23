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