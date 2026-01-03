
const express = require('express');
const multer = require('multer');
const { createCanvas, loadImage } = require('canvas');
const crypto = require('crypto');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

// CONSTANTS
const START_DELIMITER = ":::AETHER_START:::";
const END_DELIMITER = ":::AETHER_END:::";

// UTILS
const stringToBinary = (str) => {
  return str.split('').map(char => 
    char.charCodeAt(0).toString(2).padStart(8, '0')
  ).join('');
};

/**
 * POST /v1/inject
 * Public Endpoint for Invisible Watermarking
 * 
 * Headers: 
 *  - x-api-key: string
 * 
 * Body (multipart/form-data):
 *  - image: File
 *  - metadata: string (JSON string of custom data)
 */
app.post('/v1/inject', upload.single('image'), async (req, res) => {
  try {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API Key' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // 1. Load Image
    const img = await loadImage(req.file.buffer);
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    // 2. Prepare Payload
    const customMeta = req.body.metadata || "{}";
    const fingerprint = crypto.createHash('sha256').update(req.file.buffer).digest('hex').substring(0, 16);
    
    const payload = JSON.stringify({
      id: crypto.randomUUID(),
      fp: fingerprint,
      ts: Date.now(),
      meta: customMeta
    });

    const fullMessage = `${START_DELIMITER}${payload}${END_DELIMITER}`;
    const binaryMessage = stringToBinary(fullMessage);
    
    // 3. Embed (LSB Blue Channel)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    if (binaryMessage.length > data.length / 4) {
      return res.status(400).json({ error: 'Payload too large for image dimensions' });
    }

    for (let i = 0; i < binaryMessage.length; i++) {
      const pixelIndex = i * 4;
      const bit = parseInt(binaryMessage[i], 10);
      data[pixelIndex + 2] = (data[pixelIndex + 2] & ~1) | bit;
    }

    ctx.putImageData(imageData, 0, 0);

    // 4. Return Result
    const buffer = canvas.toBuffer('image/png');
    
    res.set('Content-Type', 'image/png');
    res.set('X-Aether-Trace-Id', payload.id);
    res.send(buffer);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`AetherTag API running on port ${PORT}`);
});
