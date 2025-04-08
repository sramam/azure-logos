const fs = require("fs");
const path = require("path");

// Directory that contains your icons
const iconsDir = path.join(__dirname, "Icons");
// Output JSON file that will be generated
const outputFile = path.join(__dirname, "icons.json");

/**
 * Generates a JSON object with categories (as keys) and an array of icon objects.
 * Each icon object has a "name" (derived from its file name) and a "path" (relative path to the SVG file).
 */
function generateIconData(directory) {
  const categories = {};

  // Read each subdirectory from the icons directory (each subdirectory is a category)
  const categoryDirs = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  categoryDirs.forEach((category) => {
    const categoryPath = path.join(directory, category);
    // Look for SVG files in the category directory
    const svgFiles = fs
      .readdirSync(categoryPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile() && dirent.name.endsWith(".svg"))
      .map((dirent) => dirent.name);

    // Map each SVG file into an object with a cleaned-up name and its relative path.
    categories[category] = svgFiles.map((fileName) => {
      // Remove the .svg extension.
      const baseName = fileName.replace(".svg", "");
      // Optionally remove a numeric prefix and '-icon-service-' if it exists.
      const displayName = baseName.replace(/^\d+\-icon-service\-/, "");
      // Create a path that uses forward slashes.
      const relativePath = path
        .join("Icons", category, fileName)
        .replace(/\\/g, "/");
      return {
        name: displayName,
        path: relativePath,
      };
    });
  });

  return categories;
}

// Generate the JSON data
const iconData = generateIconData(iconsDir);

// Write JSON data to the output file with a 2-space indent for readability
fs.writeFileSync(outputFile, JSON.stringify(iconData, null, 2), "utf-8");

console.log("Generated icons.json");
