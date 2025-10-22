import Feather from "@expo/vector-icons/Feather";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableHighlight,
    View,
} from "react-native";
import useFetch from "../../hooks/useFetch";
import { fetchTransactions } from "../../services/api";

function formatDate(dateStr?: string | null) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

function getColorBadge(status: string) {
    switch (status.toLowerCase()) {
        case "pending":
            return "bg-yellow-200 text-yellow-800";
        case "success":
            return "bg-green-200 text-green-800";
        case "expired":
            return "bg-red-200 text-red-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
}

function TransactionCard({ tx }: { tx: any }) {
    return (
        <View className="bg-white flex flex-row items-center gap-4 rounded-lg p-4 shadow mb-4">
            <View className="flex items-center justify-center">
                <TouchableHighlight
                    className="bg-green-300 p-1 rounded-sm"
                    onPress={() => {
                        console.log("Pressed");
                    }}
                >
                    <Feather name="check" size={24} color="white" />
                </TouchableHighlight>
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
                    <Text className="mt-2">Rp {tx.Amount}</Text>
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

export default function App() {
    const { data, loading, error, refetch } = useFetch(fetchTransactions);
    return (
        <FlatList
            data={data ?? []}
            keyExtractor={(item, index) =>
                item.TransactionID.toString() || index.toString()
            }
            refreshing={loading}
            onRefresh={refetch}
            contentContainerStyle={{ padding: 16 }}
            ListHeaderComponent={() => (
                <View>
                    <Text className="text-2xl font-bold mb-4">
                        Transactions
                    </Text>
                </View>
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
            renderItem={({ item }) => <TransactionCard tx={item} />}
        />
    );
}
