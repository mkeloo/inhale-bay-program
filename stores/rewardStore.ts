// stores/rewardStore.ts
import { create } from 'zustand';
import { Reward } from '@/utils/actions';

interface RewardStoreState {
    selectedReward: Reward | null;     // The currently selected reward
    earnedPoints: number;             // The number of points entered on the "Add Points" screen
    setSelectedReward: (reward: Reward | null) => void;
    setEarnedPoints: (points: number) => void;
    resetRewardData: () => void;
}

export const useRewardStore = create<RewardStoreState>((set) => ({
    selectedReward: null,
    earnedPoints: 0,

    setSelectedReward: (reward) => set({ selectedReward: reward }),
    setEarnedPoints: (points) => set({ earnedPoints: points }),

    // Reset store back to defaults
    resetRewardData: () => set({ selectedReward: null, earnedPoints: 0 }),
}));