/**
 * Image Optimization Script
 * 
 * This script optimizes images in the public directory to improve page load times.
 * It uses sharp to resize and compress images while maintaining quality.
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_WIDTH = 1200; // Maximum width for large images
const QUALITY = 80; // Quality setting for compression (0-100)

// Get all image files recursively
const getImageFiles = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(getImageFiles(filePath));
    } else {
      // Check if file is an image
      const ext = path.extname(file).toLowerCase();
      if (IMAGE_EXTENSIONS.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
};

// Optimize a single image
const optimizeImage = async (imagePath) => {
  try {
    const ext = path.extname(imagePath).toLowerCase();
    const imageBuffer = fs.readFileSync(imagePath);
    const metadata = await sharp(imageBuffer).metadata();
    
    // Skip if image is already optimized or small enough
    if (metadata.width <= MAX_WIDTH) {
      console.log(`Skipping ${imagePath} - already optimized`);
      return;
    }
    
    console.log(`Optimizing ${imagePath}...`);
    
    let sharpInstance = sharp(imageBuffer)
      .resize(MAX_WIDTH, null, { fit: 'inside', withoutEnlargement: true });
    
    // Apply format-specific optimizations
    if (ext === '.jpg' || ext === '.jpeg') {
      sharpInstance = sharpInstance.jpeg({ quality: QUALITY });
    } else if (ext === '.png') {
      sharpInstance = sharpInstance.png({ quality: QUALITY });
    } else if (ext === '.webp') {
      sharpInstance = sharpInstance.webp({ quality: QUALITY });
    }
    
    // Save the optimized image
    const optimizedBuffer = await sharpInstance.toBuffer();
    fs.writeFileSync(imagePath, optimizedBuffer);
    
    // Calculate size reduction
    const originalSize = imageBuffer.length;
    const optimizedSize = optimizedBuffer.length;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(2);
    
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`  Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`  Reduction: ${reduction}%`);
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error);
  }
};

// Main execution
const main = async () => {
  try {
    console.log('Scanning for images...');
    const imageFiles = getImageFiles(PUBLIC_DIR);
    
    if (imageFiles.length === 0) {
      console.log('No images found in the public directory.');
      return;
    }
    
    console.log(`Found ${imageFiles.length} images to process.`);
    
    // Process images sequentially to avoid memory issues
    for (const imagePath of imageFiles) {
      await optimizeImage(imagePath);
    }
    
    console.log('Image optimization complete!');
  } catch (error) {
    console.error('Optimization failed:', error);
  }
};

// Check if sharp is installed
const checkDependencies = () => {
  try {
    require.resolve('sharp');
    return true;
  } catch (e) {
    console.error('The "sharp" package is required but not installed.');
    console.log('Please install it using: npm install sharp --save-dev');
    return false;
  }
};

// Run the script if dependencies are met
if (checkDependencies()) {
  main();
}