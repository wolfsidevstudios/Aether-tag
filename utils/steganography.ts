/**
 * Simple LSB (Least Significant Bit) Steganography implementation.
 * It hides text data into the alpha channels or RGB channels of an image.
 * 
 * NOTE: For a production app, this should be more robust (encryption, spread spectrum),
 * but for this demo, we use a custom delimiter strategy.
 */

const START_DELIMITER = ":::AETHER_START:::";
const END_DELIMITER = ":::AETHER_END:::";

// Convert string to binary string
const stringToBinary = (str: string): string => {
  return str.split('').map(char => {
    return char.charCodeAt(0).toString(2).padStart(8, '0');
  }).join('');
};

// Convert binary string to text
const binaryToString = (binary: string): string => {
  const bytes = binary.match(/.{1,8}/g) || [];
  return bytes.map(byte => String.fromCharCode(parseInt(byte, 2))).join('');
};

export const embedWatermark = (
  imageSrc: string, 
  text: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      const fullMessage = `${START_DELIMITER}${text}${END_DELIMITER}`;
      const binaryMessage = stringToBinary(fullMessage);

      if (binaryMessage.length > data.length / 4) {
        reject(new Error("Message is too long for this image size."));
        return;
      }

      // Embed data in the Least Significant Bit of the Blue channel (index 2, 6, 10...)
      // We use Blue because the human eye is least sensitive to blue changes.
      for (let i = 0; i < binaryMessage.length; i++) {
        const pixelIndex = i * 4; // Jump to next pixel
        const bit = parseInt(binaryMessage[i], 10);
        
        // Clear the LSB
        data[pixelIndex + 2] = data[pixelIndex + 2] & ~1;
        // Set the LSB
        data[pixelIndex + 2] = data[pixelIndex + 2] | bit;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png')); // Must be PNG to preserve bits (lossless)
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
};

export const extractWatermark = (imageSrc: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let binaryMessage = "";
      
      // We need to read enough bits to at least find our delimiters.
      // In a real app, we might store the length in the first 32 bits.
      // Here we just read until we find the end delimiter or run out of pixels.
      // Optimization: Check for start delimiter early.
      
      for (let i = 0; i < data.length / 4; i++) {
        const pixelIndex = i * 4;
        const bit = data[pixelIndex + 2] & 1; // Get LSB of Blue
        binaryMessage += bit;
      }

      const rawText = binaryToString(binaryMessage);
      
      const startIndex = rawText.indexOf(START_DELIMITER);
      const endIndex = rawText.indexOf(END_DELIMITER);

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const extracted = rawText.substring(startIndex + START_DELIMITER.length, endIndex);
        resolve(extracted);
      } else {
        resolve(null);
      }
    };
    img.onerror = (e) => reject(e);
    img.src = imageSrc;
  });
};