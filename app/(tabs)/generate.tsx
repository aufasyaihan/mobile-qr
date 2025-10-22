import { GenerateQRPayload } from "@/types/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { generateQR } from "../../services/api";

export default function Generate() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        partnerReferenceNo: "",
        amount: "",
        merchantId: "",
    });

    const { loading, error, execute, setError } = useFetch(generateQR, {
        immediate: false,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async () => {
        if (!formData.partnerReferenceNo.trim()) {
            Alert.alert("Error", "Partner Reference No is required");
            return;
        }
        if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
            Alert.alert("Error", "Valid amount is required");
            return;
        }
        if (!formData.merchantId.trim()) {
            Alert.alert("Error", "Merchant ID is required");
            return;
        }

        const payload: GenerateQRPayload = {
            partnerReferenceNo: formData.partnerReferenceNo.trim(),
            amount: {
                value: parseFloat(formData.amount).toFixed(2),
                currency: "IDR",
            },
            merchantId: formData.merchantId.trim(),
        };

        try {
            const response = await execute(payload);
            if (response) {
                Alert.alert("Success", "QR Code generated successfully!", [
                    {
                        text: "OK",
                        onPress: () => {
                            setFormData({
                                partnerReferenceNo: "",
                                amount: "",
                                merchantId: "",
                            });
                            router.push({
                                pathname: "/(tabs)",
                                params: { refresh: "true" },
                            });
                        },
                    },
                ]);
            }
        } catch (err: any) {
            Alert.alert("Error", err?.message || "Failed to generate QR code");
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="p-6">
                <Text className="text-2xl font-bold mb-6">
                    Generate QR Code
                </Text>

                {error && (
                    <View className="p-4 bg-red-100 border border-red-200 rounded-md mb-4">
                        <Text className="text-red-600 font-semibold">
                            {String(error)}
                        </Text>
                    </View>
                )}

                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Partner Reference No
                        <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md px-4 py-3 text-base"
                        placeholder="e.g., DIRECT-API-NMS-whhq7gvx58"
                        value={formData.partnerReferenceNo}
                        onChangeText={(value) =>
                            handleInputChange("partnerReferenceNo", value)
                        }
                        editable={!loading}
                    />
                </View>

                <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Amount<Text className="text-red-500">*</Text>
                    </Text>
                    <View className="flex flex-row">
                        <Text className="text-sm font-semibold bg-neutral-200 text-gray-700 h-full p-4 rounded-l-md">
                            IDR
                        </Text>
                        <TextInput
                            className="border border-l-0 border-gray-300 rounded-r-md px-4 py-3 text-base flex-1"
                            placeholder="e.g., 10000.00"
                            value={formData.amount}
                            onChangeText={(value) =>
                                handleInputChange("amount", value)
                            }
                            keyboardType="decimal-pad"
                            editable={!loading}
                        />
                    </View>
                </View>
                <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                        Merchant ID<Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                        className="border border-gray-300 rounded-md px-4 py-3 text-base"
                        placeholder="e.g., EP27842182"
                        value={formData.merchantId}
                        onChangeText={(value) =>
                            handleInputChange("merchantId", value)
                        }
                        editable={!loading}
                    />
                </View>
                <TouchableOpacity
                    className={`rounded-md py-4 items-center ${
                        loading ? "bg-blue-300" : "bg-blue-600"
                    }`}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text className="text-white font-bold text-base">
                            Generate QR Code
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}
