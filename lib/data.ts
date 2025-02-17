import { ScreenCodeProps } from "@/types/type";

export const screenCodes: ScreenCodeProps[] = [
    {
        id: 1,
        name: 'client',
        code: 1111
    },
    {
        id: 2,
        name: 'handler',
        code: 2222
    },
    {
        id: 3,
        name: 'admin',
        code: 9999
    }
]


import bear from '@/assets/images/screen/avatars/bear.jpg';
import cat from '@/assets/images/screen/avatars/cat.jpg';
import cheetah from '@/assets/images/screen/avatars/cheetah.jpg';
import dog from '@/assets/images/screen/avatars/dog.jpg';
import dolphin from '@/assets/images/screen/avatars/dolphin.jpg';
import eagle from '@/assets/images/screen/avatars/eagle.jpg';
import elephant from '@/assets/images/screen/avatars/elephant.jpg';
import fox from '@/assets/images/screen/avatars/fox.jpg';
import giraffe from '@/assets/images/screen/avatars/giraffe.jpg';
import hippo from '@/assets/images/screen/avatars/hippo.jpg';
import kangaroo from '@/assets/images/screen/avatars/kangaroo.jpg';
import lion from '@/assets/images/screen/avatars/lion.jpg';
import panda from '@/assets/images/screen/avatars/panda.jpg';
import tiger from '@/assets/images/screen/avatars/tiger.jpg';
import wolf from '@/assets/images/screen/avatars/wolf.jpg';
import zebra from '@/assets/images/screen/avatars/zebra.jpg';


export const avatarsImages = [
    {
        id: 1,
        name: 'Bear',
        image: bear
    },
    {
        id: 2,
        name: 'Cat',
        image: cat
    },
    {
        id: 3,
        name: 'Cheetah',
        image: cheetah
    },
    {
        id: 4,
        name: 'Dog',
        image: dog
    },
    {
        id: 5,
        name: 'Dolphin',
        image: dolphin
    },
    {
        id: 6,
        name: 'Eagle',
        image: eagle
    },
    {
        id: 7,
        name: 'Elephant',
        image: elephant
    },
    {
        id: 8,
        name: 'Fox',
        image: fox
    },
    {
        id: 9,
        name: 'Giraffe',
        image: giraffe
    },
    {
        id: 10,
        name: 'Hippo',
        image: hippo
    },
    {
        id: 11,
        name: 'Kangaroo',
        image: kangaroo
    },
    {
        id: 12,
        name: 'Lion',
        image: lion
    },
    {
        id: 13,
        name: 'Panda',
        image: panda
    },
    {
        id: 14,
        name: 'Tiger',
        image: tiger
    },
    {
        id: 15,
        name: 'Wolf',
        image: wolf
    },
    {
        id: 16,
        name: 'Zebra',
        image: zebra
    }
];


export const rewards = [
    {
        id: 1,
        title: 'Bonus',
        name: '15% off (no tobacco)',
        reward_type: 'promo',
        days_left: 7,
    },
    {
        id: 2,
        title: 'Reward',
        name: '$5 Reward (no tobacco)',
        reward_type: 'reward',
        unlock_points: 100
    },
    {
        id: 3,
        title: 'Reward',
        name: '$10 Reward (no tobacco)',
        reward_type: 'reward',
        unlock_points: 200
    },
    {
        id: 4,
        title: 'Reward',
        name: '$15 Reward (no tobacco)',
        reward_type: 'reward',
        unlock_points: 300
    },
    {
        id: 5,
        title: 'Reward',
        name: '$20 Reward (no tobacco)',
        reward_type: 'reward',
        unlock_points: 400
    },
]

export const membershipColors = {
    New: "#22C55E", // Green
    Regular: "#FACC15", // Yellow
    VIP: "#3B82F6", // Blue
    VVIP: "#9333EA", // Purple
};