import { useMutation } from "@tanstack/react-query";
import { imageApi, videoApi } from "../../services/learn/Video.api";

export const useVideoUpload = () => {
  return useMutation({
    mutationFn: (video: File) => videoApi.upload(video),
  });
};

export const useImageUpload = () => {
  return useMutation({
    mutationFn: (image: File) => imageApi.upload(image),
  });
};
