const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const mongoose = require('mongoose');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

async function uploadToCloudinary(source, options = {}) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      source,
      {
        folder: 'golf-ecom',
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );
  });
}

// Helper to recursively scan & update objects/arrays
async function processValue(val, base64CountObj) {
  if (typeof val === 'string') {
    // Case 1: Base64 image
    if (val.startsWith('data:image/')) {
      try {
        base64CountObj.count++;
        console.log(`Uploading Base64 image #${base64CountObj.count} to Cloudinary...`);
        const cUrl = await uploadToCloudinary(val);
        console.log(`Uploaded Base64 image #${base64CountObj.count} -> ${cUrl}`);
        return cUrl;
      } catch (err) {
        console.error(`Failed to upload Base64 image:`, err.message);
        return val;
      }
    }
  }

  if (Array.isArray(val)) {
    const updatedArr = [];
    for (const item of val) {
      updatedArr.push(await processValue(item, base64CountObj));
    }
    return updatedArr;
  }

  if (val !== null && typeof val === 'object' && !(val instanceof Date) && !(val instanceof mongoose.Types.ObjectId)) {
    const updatedObj = {};
    for (const key of Object.keys(val)) {
      updatedObj[key] = await processValue(val[key], base64CountObj);
    }
    return updatedObj;
  }

  return val;
}

async function runDeepMigration() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI not found');
    process.exit(1);
  }

  const urlMap = new Map();

  // 1. Process local files in public/uploads
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const file of files) {
      const fullPath = path.join(uploadsDir, file);
      if (fs.statSync(fullPath).isFile()) {
        try {
          const relativeUrl = `/uploads/${file}`;
          console.log(`Uploading local file ${relativeUrl}...`);
          const cUrl = await uploadToCloudinary(fullPath, { use_filename: true, unique_filename: true });
          urlMap.set(relativeUrl, cUrl);
        } catch (e) {
          console.error(`Error uploading ${file}:`, e.message);
        }
      }
    }
  }

  // 2. Process local files in public/images
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    for (const file of files) {
      const fullPath = path.join(imagesDir, file);
      if (fs.statSync(fullPath).isFile()) {
        try {
          const relativeUrl = `/images/${file}`;
          console.log(`Uploading local file ${relativeUrl}...`);
          const cUrl = await uploadToCloudinary(fullPath, { use_filename: true, unique_filename: true });
          urlMap.set(relativeUrl, cUrl);
          urlMap.set(file, cUrl); // Also map bare filename if used in seed
        } catch (e) {
          console.error(`Error uploading ${file}:`, e.message);
        }
      }
    }
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const db = mongoose.connection.db;
  const collections = await db.collections();

  const base64CountObj = { count: 0 };

  for (const collection of collections) {
    const collName = collection.collectionName;
    console.log(`\nScanning & migrating collection: ${collName}...`);

    const docs = await collection.find({}).toArray();
    for (const doc of docs) {
      let modified = false;
      const docId = doc._id;

      // First, scan and replace any Base64 images directly
      const newDoc = await processValue(doc, base64CountObj);

      // Second, scan for local path replacements (e.g. /uploads/... or /images/...)
      let docStr = JSON.stringify(newDoc);
      for (const [oldPath, cloudUrl] of urlMap.entries()) {
        if (docStr.includes(oldPath)) {
          docStr = docStr.split(oldPath).join(cloudUrl);
          modified = true;
        }
      }

      const finalDoc = JSON.parse(docStr);
      delete finalDoc._id; // prevent _id immutable error

      // Update document in database
      await collection.replaceOne({ _id: docId }, finalDoc);
      console.log(`Processed & updated doc ${docId} in ${collName}`);
    }
  }

  console.log(`\nMigration complete! Total Base64 images converted to Cloudinary: ${base64CountObj.count}`);
  await mongoose.disconnect();
  process.exit(0);
}

runDeepMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
