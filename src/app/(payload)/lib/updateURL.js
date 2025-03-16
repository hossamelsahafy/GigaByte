import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import FormData from "form-data";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Media = {
  slug: "media",
  upload: false,
  fields: [
    { 
      name: "url",  // <- Payload expects this field name for display
      type: "text",
      admin: { readOnly: true }
    },
    {
      name: "filename",
      type: "text",
      required: true,
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create' && data.file) {
          // Directly use Payload's temp file
          const tempFilePath = data.file.tempFilePath;

          // Create a form for the upload
          const formData = new FormData();
          formData.append("file", fs.createReadStream(tempFilePath));
          
          try {
            // Fetch with a timeout of 30 seconds for the Cloudinary API request
            const response = await Promise.race([
              fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: formData,
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Upload Timeout')), 30000)),  // 30 second timeout
            ]);

            // Parse the Cloudinary response
            const cloudinaryData = await response.json();
            
            if (!response.ok) {
              fs.unlinkSync(tempFilePath); // Clean up the temp file if upload fails
              throw new Error('Cloudinary upload failed');
            }

            // Ensure we have the Cloudinary URL before returning
            if (cloudinaryData.url) {
              // Save the URL in the 'url' field and filename in 'filename' field
              return {
                filename: data.file.name,  // Save the filename
                url: cloudinaryData.url,   // Save the Cloudinary URL
              };
            } else {
              throw new Error('Cloudinary response does not contain a valid URL');
            }
          } catch (error) {
            console.error("Error during Cloudinary upload:", error.message);
            fs.unlinkSync(tempFilePath);  // Cleanup the temp file on failure
            throw new Error('Upload failed: ' + error.message);
          }
        }
        return data;  // If the operation is not 'create' or no file is present, return the data unchanged
      }
    ],
  },
  admin: {
    defaultColumns: ['filename', 'url'],
  },
};

export default Media;
