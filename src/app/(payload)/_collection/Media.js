const Media = {
  slug: "media",
  fields: [
    {
      name: "url",
      type: "text",
      label: "Supabase URL",
      required: true,
    },
    {
      name: "altText",
      type: "text",
      label: "Alt Text",
    },
  ],
};

export default Media;
