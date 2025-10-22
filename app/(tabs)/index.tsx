import TransactionCard from "@/components/transaction-card";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import useFetch from "../../hooks/useFetch";
import { fetchTransactions } from "../../services/api";

export default function App() {
    const { data, loading, error, execute } =
        useFetch(fetchTransactions);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const params = useLocalSearchParams();

    useEffect(() => {
        if (params.refresh === 'true') {
            execute();
        }
    }, [params.refresh, execute]);

    return (
        <>
            <FlatList
                data={data ?? []}
                keyExtractor={(item, index) =>
                    item.TransactionID.toString() || index.toString()
                }
                refreshing={loading}
                onRefresh={execute}
                contentContainerStyle={{ padding: 16 }}
                ListHeaderComponent={() => (
                    <>
                        <View>
                            <Text className="text-2xl font-bold mb-4">
                                Transactions
                            </Text>
                        </View>
                        {globalError && (
                            <View className="p-4 bg-red-100 border border-red-200 rounded-md mx-auto mb-4">
                                <Text className="text-red-600 font-semibold">
                                    {String(globalError)}
                                </Text>
                            </View>
                        )}
                    </>
                )}
                ListEmptyComponent={() => (
                    <View>
                        {loading && <ActivityIndicator />}
                        {error && (
                            <Text className="text-red-600 bg-red-100 p-4 border border-red-100 font-semibold rounded-md">
                                {String(error)}
                            </Text>
                        )}
                        {!loading && !error && (!data || data.length === 0) && (
                            <Text>No transactions found.</Text>
                        )}
                    </View>
                )}
                renderItem={({ item }) => (
                    <TransactionCard
                        tx={item}
                        refresh={execute}
                        onError={setGlobalError}
                    />
                )}
            />
        </>
    );
}
