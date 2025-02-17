export interface ScreenCodeProps {
    id: number
    name: string
    code: number
}

export interface ModalProps {
    children: React.ReactNode;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}

export interface RewardCardProps {
    title: string;
    rewardName: string;
    reward_type?: 'reward' | 'promo';
    unlock_points?: number;
    days_left?: number;
    isLocked?: boolean;
}