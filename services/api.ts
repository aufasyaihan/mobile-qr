export const API_CONFIG = {
    BASE_URL:
        process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8080/api/v1/qr",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
};

export interface TransactionResponse {
    responseCode: string;
    responseMessage: string;
    totalRecords: number;
    transactions: Transaction[];
}

export interface Transaction {
    Amount: string;
    Currency: string;
    MerchantID: string;
    PaidDate: string | null;
    PartnerReferenceNumber: string;
    ReferenceNumber: string;
    Status: string;
    TransactionDate: string;
    TransactionID: string;
}

// fetchTransactions returns the inner transactions array to match the UI usage
export async function fetchTransactions(): Promise<Transaction[]> {
    const endpoint = `${API_CONFIG.BASE_URL}/transactions`;
    const res = await fetch(endpoint, {
        method: "GET",
        headers: API_CONFIG.headers,
    });
    if (!res.ok) throw new Error(`Failed to fetch transactions: ${res.status}`);
        const body: TransactionResponse = await res.json();
        return body.transactions ?? [];
}
