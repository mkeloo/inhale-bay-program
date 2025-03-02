import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    ScrollView,
    ActivityIndicator,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { submitRequest, getRequests, fetchStores } from "@/utils/actions";
import { ChevronDown, ChevronUp } from "lucide-react-native";

const STORE_CODE = "5751"; // Hardcoded Store Code
const DEVICE_TYPE = "handler"; // Always "handler" for submitting requests

export default function SubmitRequest() {
    // Tabs for switching
    const [activeTab, setActiveTab] = useState<"submit" | "history">("submit");

    // Form fields
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [category, setCategory] = useState("Technical Issue");
    const [loading, setLoading] = useState(false);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [requests, setRequests] = useState<any[]>([]);
    const [expandedRequest, setExpandedRequest] = useState<string | null>(null);

    // Category Dropdown State
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([
        { label: "General Inquiry", value: "General Inquiry" },
        { label: "Technical Issue", value: "Technical Issue" },
        { label: "Maintenance", value: "Maintenance" },
        { label: "Feature Request", value: "Feature Request" },
    ]);

    // Fetch store ID using the store code
    useEffect(() => {
        const fetchStore = async () => {
            setLoading(true);
            try {
                const stores = await fetchStores();
                const matchedStore = stores.find((s) => s.store_code === STORE_CODE);
                if (matchedStore) setStoreId(matchedStore.id);
                else console.error("No store found for this code.");
            } catch (err) {
                console.error("Error fetching store ID:", err);
            }
            setLoading(false);
        };
        fetchStore();
    }, []);

    // Fetch past requests
    useEffect(() => {
        if (activeTab === "history" && storeId) {
            fetchRequests();
        }
    }, [activeTab, storeId]);

    const fetchRequests = async () => {
        if (!storeId) return;
        setLoading(true);
        const { success, data } = await getRequests(storeId);
        if (success) setRequests(data || []);
        setLoading(false);
    };

    // Submit Request Handler
    const handleSubmit = async () => {
        if (!subject || !message || !storeId) return alert("Please fill in all fields");

        setLoading(true);
        const { success } = await submitRequest(storeId, DEVICE_TYPE, subject, message, category);
        if (success) {
            setSubject("");
            setMessage("");
            setCategory("Technical Issue");
            alert("Request submitted successfully!");
        } else {
            alert("Failed to submit request. Try again.");
        }
        setLoading(false);
    };

    return (
        <View className="flex-1 bg-white shadow-xl rounded-xl">
            <View className="w-full flex-1 flex items-center justify-center border-[3px] border-gray-300 rounded-xl py-8 px-8 shadow-lg">
                {/* Top Tabs */}
                <View className="flex-row w-full justify-center gap-x-4 px-4 mb-8 mt-4">
                    <Pressable
                        onPress={() => setActiveTab("submit")}
                        className={`px-6 py-3 rounded-xl w-1/2 text-center active:scale-95 transition-transform duration-150 border-[3px]  
                        ${activeTab === "submit" ? "bg-gray-300 border-neutral-500" : "bg-gray-200 border-neutral-200"}`}
                    >
                        <Text
                            className={`text-xl font-bold text-center ${activeTab === "submit" ? "text-gray-900" : "text-gray-600"
                                }`}
                        >
                            Submit a Request
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setActiveTab("history")}
                        className={`px-6 py-3 rounded-xl w-1/2 text-center active:scale-95 transition-transform duration-150 border-[3px]  
                        ${activeTab === "history" ? "bg-gray-300 border-neutral-500" : "bg-gray-200 border-neutral-200"}`}
                    >
                        <Text
                            className={`text-xl font-bold text-center ${activeTab === "history" ? "text-gray-900" : "text-gray-600"
                                }`}
                        >
                            Past Requests
                        </Text>
                    </Pressable>
                </View>

                {/* Content Area */}
                {activeTab === "submit" ? (
                    <View className="w-full flex-1 p-5 bg-gray-100 rounded-xl">
                        {/* Title & Submit Button in One Row */}
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-3xl font-bold">Submit a Request</Text>

                            {/* Submit Button */}
                            <Pressable
                                onPress={handleSubmit}
                                className="bg-blue-600 px-6 py-3 rounded-lg flex items-center justify-center active:scale-95 transition-transform duration-150"
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text className="text-white text-lg font-bold">Submit</Text>
                                )}
                            </Pressable>
                        </View>


                        {/* Keyboard Avoiding View */}
                        <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            className="flex-1"
                        >
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                                <View className="w-full flex-1">
                                    <View>
                                        {/* Subject Input */}
                                        <Text className="text-lg font-semibold mb-2">Subject</Text>
                                        <TextInput
                                            value={subject}
                                            onChangeText={setSubject}
                                            className="border border-gray-400 rounded-lg p-4 bg-white mb-4"
                                            placeholder="Enter subject"
                                        />

                                        {/* Category Dropdown */}
                                        <Text className="text-lg font-semibold mb-2">Request Category</Text>
                                        <View className="z-50">
                                            <DropDownPicker
                                                open={open}
                                                value={category}
                                                items={categories}
                                                setOpen={setOpen}
                                                setValue={setCategory}
                                                setItems={setCategories}
                                                placeholder="Select Category"
                                                containerStyle={{ marginBottom: 20 }}
                                                style={{ borderColor: "#A0A0A0", borderRadius: 10 }}
                                                dropDownContainerStyle={{ backgroundColor: "#FAFAFA" }}
                                            />
                                        </View>

                                        {/* Message Input */}
                                        <Text className="text-lg font-semibold mb-2">Message</Text>
                                        <TextInput
                                            value={message}
                                            onChangeText={setMessage}
                                            className="border border-gray-400 rounded-lg p-4 bg-white mb-4 h-32 text-left"
                                            multiline
                                            placeholder="Describe your request"
                                        />
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </KeyboardAvoidingView>
                    </View>
                ) : (
                    <ScrollView className="w-full flex-1 p-5 bg-gray-100 rounded-xl">
                        <Text className="text-3xl font-bold text-center mb-6">Past Requests</Text>

                        {loading ? (
                            <ActivityIndicator size="large" color="gray" />
                        ) : requests.length === 0 ? (
                            <Text className="text-xl text-gray-600 text-center">No requests found</Text>
                        ) : (
                            requests.map((req) => (
                                <View key={req.id} className="mb-4 rounded-xl">
                                    {/* Request Header */}
                                    <Pressable
                                        onPress={() =>
                                            setExpandedRequest(expandedRequest === req.id ? null : req.id)
                                        }
                                        className="flex-row justify-between items-center px-4 py-3 bg-gray-200 border border-gray-400 rounded-xl"
                                    >
                                        <View className="flex-row items-center">
                                            <Text className="text-xl font-bold text-gray-800">{req.subject}</Text>
                                        </View>

                                        <View className="flex flex-row items-center justify-between gap-x-4">
                                            {/* Status Badge in Header */}
                                            <View className={`px-3 py-1 rounded-lg flex-row items-center ${req.status === "Pending" ? "bg-yellow-100" :
                                                req.status === "In Progress" ? "bg-blue-100" :
                                                    "bg-green-100"
                                                }`}>
                                                <View className={`w-3 h-3 rounded-full mr-2 ${req.status === "Pending" ? "bg-yellow-600" :
                                                    req.status === "In Progress" ? "bg-blue-600" :
                                                        "bg-green-600"
                                                    }`} />
                                                <Text className={`text-lg font-bold ${req.status === "Pending" ? "text-yellow-700" :
                                                    req.status === "In Progress" ? "text-blue-700" :
                                                        "text-green-700"
                                                    }`}>
                                                    {req.status}
                                                </Text>
                                            </View>

                                            {/* Expand/Collapse Icon */}
                                            {expandedRequest === req.id ? (
                                                <ChevronUp size={24} color="black" />
                                            ) : (
                                                <ChevronDown size={24} color="black" />
                                            )}
                                        </View>
                                    </Pressable>

                                    {/* Expanded Content */}
                                    {expandedRequest === req.id && (
                                        <View className="p-4 bg-white rounded-xl border border-gray-400 mt-2">
                                            {/* Top Row: Category & Submitted Timestamp */}
                                            <View className="flex-row justify-between items-center">
                                                {/* Category */}
                                                <Text className="text-lg text-gray-700">
                                                    <Text className="font-semibold">Category:</Text> {req.category}
                                                </Text>

                                                {/* Submitted Timestamp */}
                                                <Text className="text-sm text-gray-500">
                                                    Submitted: {new Date(req.submitted_at).toLocaleString()}
                                                </Text>
                                            </View>

                                            {/* Request Message */}
                                            <View className="mt-2">
                                                <Text className="text-lg font-semibold text-gray-700 mb-1">Request Message:</Text>
                                                <Text className="text-lg text-gray-700">{req.message}</Text>
                                            </View>

                                            {/* Update Information (Only Show if Updated Timestamp is Different from Submitted) */}
                                            {req.updated_at && req.updated_at !== req.submitted_at && (
                                                <View className="mt-4">
                                                    <Text className="text-lg font-semibold text-gray-700 mb-1">Update Information:</Text>
                                                    <Text className="text-lg text-gray-700">{req.update_info || "No updates yet"}</Text>

                                                    {/* Updated At Timestamp */}
                                                    <Text className="text-sm text-gray-500 mt-1">
                                                        Updated: {new Date(req.updated_at).toLocaleString()}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}