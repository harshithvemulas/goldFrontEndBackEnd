import { z } from "zod";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3;
const ACCEPTED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
];

// file schema
const FileSchema = z
  .any()
  .optional()
  .refine((file) => {
    return !file || file.size <= MAX_UPLOAD_SIZE;
  }, "File size must be less than 3MB")
  .refine((file) => {
    return !file || ACCEPTED_FILE_TYPES.includes(file.type);
  }, "File must be a PNG,JPEG,JPG,WEBP");

// form schema
export const KYCDocumentFormSchema = z.object({
  documentType: z.string({ required_error: "Document type is required." }),
  documentFrontSide: FileSchema,
  documentBackSide: FileSchema,
  selfie: FileSchema,
});

// kyc document form data type
export type KYCDocumentFormData = z.infer<typeof KYCDocumentFormSchema>;
