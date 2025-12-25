import axiosInstance from "../../lib/axios";

export const videoApi = {
  upload: async (video: File) => {
    const formData = new FormData();
    formData.append("video", video);

    const { data } = await axiosInstance.post<{
      success?: boolean;
      error?: string;
      maxId: string;
      assetId: string;
      playbackId: string;
    }>("/mux-video/upload", formData);

    // Check for error response even if status is 200
    if (data.success === false || data.error) {
      throw new Error(data.error || "Failed to upload video");
    }

    // Validate required fields
    if (!data.assetId) {
      throw new Error("Invalid response: missing assetId");
    }
    
    return data;
  },
};
