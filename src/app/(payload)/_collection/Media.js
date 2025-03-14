import cloudinary from "../lib/cloudinary";

const Media = {
  slug: "media",
  upload: {
    staticURL: null,
    staticDir: null,
    handler: async ({ file }) => {
      "use server";
      try {
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "uploads", resource_type: "auto" },
            (error, result) => {
              if (error) reject(new Error("Upload failed"));
              else resolve(result);
            }
          );
          uploadStream.end(file.buffer);
        });
        return { url: result.secure_url }; // Directly return Cloudinary URL
      } catch (error) {
        throw new Error("Upload failed");
      }
    },
  },
  fields: [
    {
      name: "url", // Use default 'url' field name
      type: "text",
      label: "Cloudinary URL",
      admin: { readOnly: true },
    },
    // Keep default media fields if needed
    { name: "filename", type: "text", admin: { readOnly: true } },
    { name: "mimeType", type: "text", admin: { readOnly: true } },
  ],
};

export default Media;
