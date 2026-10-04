const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const inputDir = path.join(__dirname, 'src/assets');
const outputDir = path.join(__dirname, 'src/assets-webp');

fs.ensureDirSync(outputDir);

function convertImagesFromDir(dir, outputBaseDir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  entries.forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const outputPath = path.join(outputBaseDir, path.relative(inputDir, fullPath));

    if (entry.isDirectory()) {
      fs.ensureDirSync(outputPath);
      convertImagesFromDir(fullPath, outputBaseDir);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      const fileName = path.basename(entry.name, ext);

      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const finalOutputPath = path.join(path.dirname(outputPath), `${fileName}.webp`);

        sharp(fullPath)
          .webp({ quality: 80 })
          .toFile(finalOutputPath)
          .then(() => console.log(`✅ Converted: ${entry.name} -> ${fileName}.webp`))
          .catch(err => console.error(`❌ Error converting ${entry.name}:`, err));
      }
    }
  });
}

convertImagesFromDir(inputDir, outputDir);
