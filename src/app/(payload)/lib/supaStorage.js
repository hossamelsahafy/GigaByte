import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Make sure this is the SERVICE ROLE KEY
);

const Media = {
  slug: "media",
  upload: false, // Disable Payload's default upload handling
  fields: [
    {
      name: "url",
      type: "text",
      label: "Image URL",
      required: true,
    },
    {
      name: "altText",
      type: "text",
      label: "Alt Text",
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (!req?.files?.file) {
          throw new Error("No file uploaded");
        }

        const file = req.files.file;
        const fileExt = file.name.split(".").pop();
        const filePath = `uploads/${Date.now()}.${fileExt}`;

        // 🔥 Upload file to Supabase
        const { data: uploadData, error } = await supabase.storage
          .from("media")
          .upload(filePath, file.data, {
            contentType: file.mimetype,
          });

        if (error) {
          throw new Error(`Supabase upload failed: ${error.message}`);
        }

        data.url = `${process.env.SUPABASE_URL}/storage/v1/object/public/media/${filePath}`;
        console.log(data);

        return data;
      },
    ],
  },
};

export default Media;
