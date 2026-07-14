import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const SOURCE_DIR = 'D:\\Portfolio-Source';
const PROJECT_ROOT = path.resolve(__dirname, '..');
const PUBLIC_UPLOADS_DIR = path.join(PROJECT_ROOT, 'public', 'uploads');
const DB_OUTPUT_FILE = path.join(PROJECT_ROOT, 'src', 'data', 'projects.json');

// Ensure directories exist
if (!fs.existsSync(PUBLIC_UPLOADS_DIR)) {
  fs.mkdirSync(PUBLIC_UPLOADS_DIR, { recursive: true });
  console.log(`Created uploads directory: ${PUBLIC_UPLOADS_DIR}`);
}

const DB_DIR = path.dirname(DB_OUTPUT_FILE);
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Helper to slugify folder names
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
}

// Parse info.txt file robustly
function parseInfoFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/);
  
  const data = {};
  let currentKey = null;
  let currentValue = '';

  const knownKeys = [
    'title', 'tagline', 'year', 'role', 'tags', 'github', 'demo', 
    'challenge', 'solution', 'outcome', 'description', 'image'
  ];

  for (let line of lines) {
    // Skip comments
    if (line.trim().startsWith('#')) {
      continue;
    }

    // Check if line starts with a key (e.g. "Title:")
    const match = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (match) {
      // If we were collecting a previous key, save it
      if (currentKey) {
        data[currentKey] = currentValue.trim();
      }

      const keyCandidate = match[1].toLowerCase();
      if (knownKeys.includes(keyCandidate)) {
        currentKey = keyCandidate;
        currentValue = match[2];
      } else {
        // Unknown key, treat as continuation of previous key or ignore
        if (currentKey) {
          currentValue += '\n' + line;
        }
      }
    } else {
      // Continuation of multi-line value
      if (currentKey) {
        currentValue += '\n' + line;
      }
    }
  }

  // Save the last key
  if (currentKey) {
    data[currentKey] = currentValue.trim();
  }

  return data;
}

function sync() {
  console.log(`Scanning source folder: ${SOURCE_DIR}...`);
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Error: Source directory ${SOURCE_DIR} does not exist. Please create it first.`);
    process.exit(1);
  }

  const folders = fs.readdirSync(SOURCE_DIR).filter(file => {
    const fullPath = path.join(SOURCE_DIR, file);
    return fs.statSync(fullPath).isDirectory();
  });

  const projects = [];
  let idCounter = 1;

  for (const folder of folders) {
    // Skip template folder
    if (folder === 'Template-Project') {
      console.log(`Skipping template folder: ${folder}`);
      continue;
    }

    const folderPath = path.join(SOURCE_DIR, folder);
    const infoPath = path.join(folderPath, 'info.txt');

    if (!fs.existsSync(infoPath)) {
      console.warn(`Warning: Folder ${folder} does not contain an info.txt file. Skipping.`);
      continue;
    }

    console.log(`Processing project folder: ${folder}...`);
    const parsedData = parseInfoFile(infoPath);

    // Skip if title matches template placeholder or is missing
    if (!parsedData.title || parsedData.title === 'My Project Title') {
      console.log(`Skipping template or untitled project in folder: ${folder}`);
      continue;
    }

    const slug = slugify(folder);
    const files = fs.readdirSync(folderPath);

    const localImageFiles = [];
    let localVideoFile = null;

    // Detect image and video files
    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        localImageFiles.push(file);
      } else if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
        localVideoFile = file;
      }
    }

    const project = {
      id: idCounter++,
      title: parsedData.title || folder,
      tagline: parsedData.tagline || '',
      description: parsedData.description || '',
      tags: parsedData.tags ? parsedData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      image: parsedData.image || '',
      images: [],
      challenge: parsedData.challenge || '',
      solution: parsedData.solution || '',
      outcome: parsedData.outcome || '',
      github: parsedData.github || 'https://github.com',
      demo: parsedData.demo || 'https://example.com',
      year: parsedData.year || new Date().getFullYear().toString(),
      role: parsedData.role || 'Developer'
    };

    // Copy local images if found
    if (localImageFiles.length > 0) {
      localImageFiles.sort();
      for (let i = 0; i < localImageFiles.length; i++) {
        const file = localImageFiles[i];
        const ext = path.extname(file);
        const destFilename = `${slug}-image-${i}${ext}`;
        const srcPath = path.join(folderPath, file);
        const destPath = path.join(PUBLIC_UPLOADS_DIR, destFilename);

        fs.copyFileSync(srcPath, destPath);
        const relativeUrl = `/uploads/${destFilename}`;
        project.images.push(relativeUrl);
        console.log(`  Copied image [${i}]: ${file} -> ${relativeUrl}`);
      }
    }

    // Set main cover image (respect info.txt if present, otherwise default to first local image)
    if (parsedData.image) {
      project.image = parsedData.image;
      // Prepend to images array if not already included
      if (!project.images.includes(parsedData.image)) {
        project.images.unshift(parsedData.image);
      }
    } else if (project.images.length > 0) {
      project.image = project.images[0];
    }

    // Copy local video if found
    if (localVideoFile) {
      const ext = path.extname(localVideoFile);
      const destFilename = `${slug}-video${ext}`;
      const srcPath = path.join(folderPath, localVideoFile);
      const destPath = path.join(PUBLIC_UPLOADS_DIR, destFilename);

      fs.copyFileSync(srcPath, destPath);
      project.video = `/uploads/${destFilename}`;
      console.log(`  Copied video: ${localVideoFile} -> ${project.video}`);
    }

    projects.push(project);
  }

  // Sort projects by ID descending (or keep order)
  fs.writeFileSync(DB_OUTPUT_FILE, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`\nSuccessfully synchronized ${projects.length} projects!`);
  console.log(`Database saved to: ${DB_OUTPUT_FILE}`);
}

sync();
