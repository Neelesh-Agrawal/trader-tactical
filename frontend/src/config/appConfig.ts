export const APP_MODE: string = import.meta.env.VITE_APP_MODE || "PROD";

export const isAuthRequired = () => APP_MODE === "PROD";
