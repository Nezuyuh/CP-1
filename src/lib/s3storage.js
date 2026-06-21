const supabase = require('./supabase');

const BUCKET = 'requirement';

async function uploadFile(path, buffer, contentType) {
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType,
    upsert: false,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function uploadTourImage(filename, buffer, contentType) {
  const { error } = await supabase.storage.from('tours_img').upload(filename, buffer, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  const { data } = supabase.storage.from('tours_img').getPublicUrl(filename);
  return data.publicUrl;
}

module.exports = { uploadFile, uploadTourImage };
