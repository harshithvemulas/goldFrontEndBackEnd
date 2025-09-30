import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 5; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];
const ACCEPTED_FAVICON_TYPES = [
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/png",
];

export const ImageSchema = z
  .union([z.string(), z.instanceof(File)])
  .optional()
  .refine((value) => {
    if (!value || typeof value === "string") return true;

    return value instanceof File && value.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 5MB")
  .refine((value) => {
    if (!value || typeof value === "string") return true;

    return value instanceof File && ACCEPTED_IMAGE_TYPES.includes(value.type);
  }, "Invalid file format. Please upload a .jpg, .jpeg, .png or .svg file.");

export const FaviconSchema = z
  .union([z.string(), z.instanceof(File)])
  .optional()
  .refine((value) => {
    if (!value || typeof value === "string") return true;

    return value instanceof File && value.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 5MB")
  .refine((value) => {
    if (!value || typeof value === "string") return true;

    return value instanceof File && ACCEPTED_FAVICON_TYPES.includes(value.type);
  }, "Invalid file format. Please upload a .ico or .png file.");
