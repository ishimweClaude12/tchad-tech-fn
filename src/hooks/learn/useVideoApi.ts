import { useMutation } from "@tanstack/react-query";
import { videoApi } from "../../services/learn/Video.api";

export const useVideoUpload = () => {
  return useMutation({
    mutationFn: (video: File) => videoApi.upload(video),
  });
};
