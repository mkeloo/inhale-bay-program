import { View, Modal, Platform, Pressable } from "react-native";
import React from "react";
import { ModalProps } from "@/types/type";
import { BlurView } from "expo-blur";
import { X } from "lucide-react-native";
import {
    configureReanimatedLogger,
    ReanimatedLogLevel,
} from "react-native-reanimated";

// This is the default configuration
configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false, // Reanimated runs in strict (true) mode by default
});

export default function ModalContentWrapper({
    children,
    modalVisible,
    setModalVisible,
}: ModalProps) {
    return (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="fade"
            statusBarTranslucent={true}
            onRequestClose={() => setModalVisible(false)}
        >
            <View className="flex-1 py-6 w-full items-center justify-center ">
                {/* Blurred Background */}
                {Platform.OS === "ios" ? (
                    <BlurView intensity={30} className="absolute inset-0" tint="dark" />
                ) : (
                    <View
                        style={{
                            backgroundColor: "rgba(0,0,0,0.4)",
                            position: "absolute",
                            inset: 0,
                        }}
                    />
                )}
                {/* Modal Content */}
                <View className="bg-white w-full h-full max-w-3xl p-6 pt-12 rounded-2xl items-center relative">
                    {/* Close Button (Top-Right) */}
                    <Pressable
                        onPress={() => setModalVisible(false)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-indigo-20 active:scale-90 transition-transform duration-150"
                    >
                        <X size={24} color="#2B3252" />
                    </Pressable>

                    {/* Modal Content */}
                    {children}
                </View>
            </View>
        </Modal >
    );
}