
// Replaced AI service with local cryptographic hashing for privacy and offline capability
export const generateImageSignature = async (imageFile: File): Promise<string> => {
  try {
    // Create a SHA-256 hash of the image file content
    const buffer = await imageFile.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    
    // Convert to hex string
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Return a concise fingerprint (first 16 chars are sufficient for a unique ID)
    return `FP-${hashHex.substring(0, 16).toUpperCase()}`;
  } catch (error) {
    console.error("Signature Generation Error:", error);
    // Fallback if crypto API fails
    return `Local-Sig-${Date.now().toString(36)}`;
  }
};
