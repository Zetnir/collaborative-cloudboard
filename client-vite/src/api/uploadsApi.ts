import axiosInstance from "./axiosInstance";

export interface UploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resourceType: string;
  createdAt: string;
}

export const uploadsApi = {
  upload: async (
    file: File,
    options?: { folder?: string; tags?: string },
  ): Promise<UploadResult> => {
    const formData = new FormData();
    console.log(file);
    formData.append("file", file);
    if (options?.folder) formData.append("folder", options.folder);
    if (options?.tags) formData.append("tags", options.tags);

    console.log(formData);
    const response = await axiosInstance.post<UploadResult>(
      "/uploads",
      formData,
    );
    return response.data;
  },

  getImageInfo: async (publicId: string): Promise<UploadResult> => {
    const response = await axiosInstance.get<UploadResult>("/uploads", {
      params: { publicId },
    });
    return response.data;
  },
};
