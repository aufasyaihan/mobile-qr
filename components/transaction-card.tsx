import { PaymentCallbackPayload } from "@/types/types";
import { formatCurrency, formatDate, getColorBadge } from "@/utils/utils";
import Feather from "@expo/vector-icons/Feather";
import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import useFetch from "../hooks/useFetch";
import { sendPaymentCallback } from "../services/api";

export default function TransactionCard({
    tx,
    refresh,
    onError,
}: {
    tx: any;
    refresh?: () => void;
    onError?: (error: string | null) => void;
}) {
    const { loading, execute: send } = useFetch<[PaymentCallbackPayload], any>(
        sendPaymentCallback,
        {
            immediate: false,
        }
    );

    async function onSend() {
        const payload: PaymentCallbackPayload = {
            originalReferenceNo: tx.ReferenceNumber ?? tx.TransactionID ?? null,
            originalPartnerReferenceNo: tx.PartnerReferenceNumber ?? null,
            transactionStatusDesc: "SUCCESS",
            paidTime:
                tx.PaidDate ?? tx.TransactionDate ?? new Date().toISOString(),
            amount: {
                value:
                    typeof tx.Amount === "number"
                        ? tx.Amount.toFixed(2)
                        : String(tx.Amount ?? "0.00"),
                currency: tx.Currency ?? "IDR",
            },
        };
        try {
            await send(payload);
            if (refresh) refresh();
            if (onError) onError(null);
        } catch (err) {
            console.warn("send payment callback failed", err);
            if (onError)
                onError(String(err) || "Failed to send payment callback");
        }
    }

    return (
        <View className="bg-white flex flex-row items-center gap-4 rounded-lg p-4 shadow mb-4">
            <View className="flex items-center justify-center">
                <TouchableOpacity
                    className="bg-green-300 p-1 rounded-sm disabled:bg-neutral-200"
                    onPress={onSend}
                    disabled={tx.Status.toLowerCase() === "success" || loading}
                    style={{ opacity: loading ? 0.6 : 1 }}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Feather name="check" size={24} color="white" />
                    )}
                </TouchableOpacity>
            </View>
            <View className="flex flex-row justify-between items-center flex-1">
                <View className="w-1/2">
                    <Text
                        className="font-bold w-full"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {tx.PartnerReferenceNumber ?? tx.ReferenceNumber ?? "—"}
                    </Text>
                    <Text className="mt-2">
                        Rp{formatCurrency(tx.Amount)}
                    </Text>
                </View>
                <View className="flex items-end">
                    <Text
                        className={`text-sm ${getColorBadge(tx.Status)} px-2 py-1 rounded-full`}
                    >
                        {tx.Status ?? ""}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-2">
                        {formatDate(tx.PaidDate) ||
                            formatDate(tx.TransactionDate) ||
                            ""}
                    </Text>
                </View>
            </View>
        </View>
    );
}
