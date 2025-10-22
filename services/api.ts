import { GenerateQRPayload, GenerateQRResponse, PaymentCallbackPayload, Transaction, TransactionResponse } from "@/types/types";

export const API_CONFIG = {
    BASE_URL:
        process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8080/api/v1/qr",
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
};

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

export async function generateQR(payload: GenerateQRPayload): Promise<GenerateQRResponse> {
    const endpoint = `${API_CONFIG.BASE_URL}/generate`;
    const res = await fetch(endpoint, {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Failed to generate QR: ${res.status} ${text}`);
    }
    return res.json();
}
