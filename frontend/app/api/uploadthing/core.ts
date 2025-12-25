import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  companyLogo: f({ image: { maxFileSize: "5MB" } })
    // Add auth metadata here if needed (e.g., user/company id)
    .middleware(() => ({ uploadedBy: "company" }))
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        url: file.url,
        key: file.key,
        uploadedBy: metadata.uploadedBy,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
