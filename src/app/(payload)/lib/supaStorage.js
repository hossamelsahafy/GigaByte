import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const uploadFile = async (
  buffer,
  filename,
  bucket = "gigabyteimages"
) => {
  const fileExtension = filename.split(".").pop();
  const uniqueFilename = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 15)}.${fileExtension}`;
  const filePath = `seo/${uniqueFilename}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer);

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  return {
    path: data.path,
    publicUrl: `${process.env.SUPABASE_URL}/storage/v1/object/public/${bucket}/${data.path}`,
  };
};

export const deleteFile = async (filePath, bucket = "seo-media") => {
  const { error } = await supabase.storage.from(bucket).remove([filePath]);

  if (error) throw new Error(`Supabase deletion failed: ${error.message}`);
};
