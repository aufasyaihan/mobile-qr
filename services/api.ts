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

export interface PaymentCallbackPayload {
    originalReferenceNo: string | null;
    originalPartnerReferenceNo: string | null;
    transactionStatusDesc: string;
    paidTime: string;
    amount: {
        value: string;
        currency: string;
    };
}

export async function sendPaymentCallback(payload: PaymentCallbackPayload) {
    const endpoint = `${API_CONFIG.BASE_URL}/payment`;
    const res = await fetch(endpoint, {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to send payment callback: ${res.status} ${text}`);
    }
    return res.json().catch(() => null);
}
