import axiosInstance from "../../lib/axios";

export const videoApi = {
  upload: async (video: File) => {
    const formData = new FormData();
    formData.append("video", video);

    const { data } = await axiosInstance.post<{
      maxId: string;
      assetId: string;
      playbackId: string;
    }>("/mux-video/upload", formData);
    return data;
  },
};
