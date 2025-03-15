// Media.js - Fix the collection definition
const Media = {
  slug: "media",
  upload: true,
  fields: [
    // ✅ Must have this array (even if empty)
    // Add any custom fields here
    {
      name: "altText",
      type: "text",
      label: "Alt Text",
    },
  ],
};

export default Media;
