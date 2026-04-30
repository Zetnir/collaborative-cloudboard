import { Request, Response } from "express";
import { Readable } from "stream";
import cloudinary from "../config/storage.js";

interface UploadResultDto {
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

const toDto = (result: any): UploadResultDto => ({
  publicId: result.public_id,
  url: result.url,
  secureUrl: result.secure_url,
  format: result.format,
  width: result.width,
  height: result.height,
  bytes: result.bytes,
  resourceType: result.resource_type,
  createdAt: result.created_at,
});

export const uploadImage = async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file provided" });
  }

  const { folder, tags } = req.body as { folder?: string; tags?: string };

  try {
    const uploadOptions = {
      ...(folder && { folder }),
      ...(tags && { tags: tags.split(",") }),
    };

    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      Readable.from(req.file!.buffer).pipe(stream);
    });

    return res.status(201).json(toDto(result));
  } catch (error) {
    return res.status(500).json({ message: "Upload failed", error });
  }
};

export const getImageInfo = async (req: Request, res: Response) => {
  const { publicId } = req.query as { publicId?: string };

  if (!publicId) {
    return res
      .status(400)
      .json({ message: "publicId query parameter is required" });
  }

  try {
    const result = await cloudinary.api.resource(publicId);
    return res.status(200).json(toDto(result));
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable to fetch image info", error });
  }
};
