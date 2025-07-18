const fs = require('fs');
const path = require('path');

// Paths
const imagesDir = path.join(__dirname, 'app/public/images');
const outputFilePath = path.join(__dirname, 'app/public/photos.json');

// Generate JSON
fs.readdir(imagesDir, (err, files) => {
  if (err) {
    console.error('Error reading images directory:', err);
    return;
  }

  const photos = files
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file)) // Filter image files
    .map((file, index) => ({
      id: index + 1,
      src: `/images/${file}`,
      description: `Image: ${file}` // Customize description as needed
    }));

  fs.writeFileSync(outputFilePath, JSON.stringify(photos, null, 2));
  console.log(`Photo data written to ${outputFilePath}`);
});
