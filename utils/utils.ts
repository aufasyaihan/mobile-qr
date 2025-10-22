export function formatDate(dateStr?: string | null) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

export function getColorBadge(status: string) {
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