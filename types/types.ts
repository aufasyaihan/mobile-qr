
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

export interface GenerateQRPayload {
    partnerReferenceNo: string;
    amount: {
        value: string;
        currency: string;
    };
    merchantId: string;
}

export interface GenerateQRResponse {
    responseCode: string;
    responseMessage: string;
    referenceNo?: string;
    qrContent?: string;
}