/** @type {import('payload/types').CollectionConfig} */
import { put } from "@vercel/blob";

const Media = {
  slug: "media",
  upload: {
    mimeTypes: ["image/*"], // Restrict to image types only (e.g., image/png, image/jpeg)
  },
  fields: [
    {
      name: "url", // Store the Vercel Blob URL
      type: "text",
      required: true,
    },
    {
      name: "filename", // Optional: store the filename
      type: "text",
    },
    {
      name: "mimeType", // Optional: store the MIME type
      type: "text",
    },
    {
      name: "filesize", // Optional: store the file size
      type: "number",
    },
  ],
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        if (req.files?.file) {
          const file = req.files.file;

          if (!file.mimetype.startsWith("image/")) {
            throw new Error("Only image files are allowed");
          }

          const filename = `${Date.now()}-${file.filename}`;

          const blob = await put(`uploads/${filename}`, file.buffer, {
            access: "public",
            contentType: file.mimetype,
          });

          return {
            ...data,
            url: blob.url,
            filename: filename,
            mimeType: file.mimetype,
            filesize: file.size,
          };
        }
        return data;
      },
    ],
  },
};

export default Media;
