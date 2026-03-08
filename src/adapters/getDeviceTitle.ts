export const getDeviceTitle = (userAgent: string | undefined): string => {

    if (!userAgent) return "Unknown";
    if (userAgent.includes("Chrome")) { return "Chrome"; }
    if (userAgent.includes("Firefox")) { return "Firefox"; }
    if (userAgent.includes("Safari")) { return "Safari"; }
    if (userAgent.includes("Edg")) { return "Edge"; }
    return "Unknown";

}