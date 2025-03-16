export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Convert Base64 to image URL
export const base64ToImageUrl = (base64) => {
  return base64; // Base64 strings can be used directly in <img src>
};
