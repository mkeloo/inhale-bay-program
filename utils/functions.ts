import { avatarsImages } from "@/lib/data";

export const getAvatar = (avatar_name: string) => {
    return avatarsImages.find((avatar) => avatar.name === avatar_name)?.image;
};