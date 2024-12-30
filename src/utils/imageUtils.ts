export const getFullImagePath = (fileName: string) => {
    if (fileName.includes('http')) {
        return fileName;
    }

    const baseUrl = import.meta.env.VITE_APP_API_URL as string;
    return `${baseUrl}/uploads/${fileName}`;
};
