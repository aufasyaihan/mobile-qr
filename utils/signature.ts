import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.EXPO_PUBLIC_SECRET_KEY || "secret-key";

export function generateSignature(data: string): string {
    const hmac = CryptoJS.HmacSHA256(data, SECRET_KEY);
    return hmac.toString(CryptoJS.enc.Hex);
}