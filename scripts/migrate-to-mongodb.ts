import admin from 'firebase-admin';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

// Configuration validation
const FIREBASE_KEY_PATH = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './service-account.json';
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'ansanweb';
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.error('❌ Cloudinary configuration is missing in environment variables.');
  process.exit(1);
}

if (!fs.existsSync(FIREBASE_KEY_PATH)) {
  console.error(`❌ Firebase service account key not found at: ${FIREBASE_KEY_PATH}`);
  console.error('Please download your Firebase Service Account JSON and place it there, or set FIREBASE_SERVICE_ACCOUNT_PATH.');
  process.exit(1);
}

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync(FIREBASE_KEY_PATH, 'utf8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${serviceAccount.project_id}.appspot.com`,
});

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

// Initialize Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper: Upload file buffer to Cloudinary
async function uploadToCloudinary(buffer: Buffer, originalName: string, folder: string): Promise<string> {
  const publicId = path.parse(originalName).name.replace(/[^a-zA-Z0-9]/g, '_');
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ansanweb/${folder}`,
        public_id: `${Date.now()}_${publicId}`,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error(`❌ Cloudinary upload error for ${originalName}:`, error);
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed with empty result.'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// Helper: Migrate an image structure
async function migrateImageField(imageObj: any, folderName: string): Promise<any> {
  if (!imageObj) return null;
  
  const pathVal = imageObj.path;
  const urlVal = imageObj.url;

  if (pathVal) {
    try {
      console.log(`⏳ Downloading from Firebase Storage path: ${pathVal}...`);
      const file = bucket.file(pathVal);
      
      const [exists] = await file.exists();
      if (!exists) {
        console.warn(`⚠️ File does not exist in Firebase Storage: ${pathVal}. Keeping original URL.`);
        return imageObj;
      }

      const [buffer] = await file.download();
      const fileName = path.basename(pathVal);
      console.log(`⏳ Uploading to Cloudinary: ${fileName}...`);
      const cloudinaryUrl = await uploadToCloudinary(buffer, fileName, folderName);
      console.log(`✅ Uploaded to Cloudinary: ${cloudinaryUrl}`);
      
      return {
        url: cloudinaryUrl,
        path: `cloudinary://${folderName}/${fileName}`,
        imageHint: imageObj.imageHint || '',
      };
    } catch (err) {
      console.error(`❌ Failed to migrate image path ${pathVal}:`, err);
      // Fallback to original
      return imageObj;
    }
  } else if (urlVal && urlVal.includes('firebasestorage.googleapis.com')) {
    // If there is no path, but it's a firebase storage URL, try to parse the path from URL
    try {
      const decodedUrl = decodeURIComponent(urlVal);
      const matches = decodedUrl.match(/\/o\/(.+?)\?/);
      if (matches && matches[1]) {
        const parsedPath = matches[1];
        console.log(`⏳ Parsed Storage path from URL: ${parsedPath}...`);
        const file = bucket.file(parsedPath);
        const [buffer] = await file.download();
        const fileName = path.basename(parsedPath);
        const cloudinaryUrl = await uploadToCloudinary(buffer, fileName, folderName);
        return {
          url: cloudinaryUrl,
          path: `cloudinary://${folderName}/${fileName}`,
          imageHint: imageObj.imageHint || '',
        };
      }
    } catch (err) {
      console.error(`❌ Failed to migrate image from URL ${urlVal}:`, err);
    }
  }
  return imageObj;
}

// Main migration runner
async function runMigration() {
  console.log('🚀 Starting Data Migration: Firebase ➔ MongoDB & Cloudinary...');
  
  // Connect to MongoDB
  const mongoClient = new MongoClient(MONGODB_URI!);
  await mongoClient.connect();
  console.log('✅ Connected to MongoDB.');
  const db = mongoClient.db(MONGODB_DB_NAME);

  const collectionsToMigrate = [
    { name: 'categories', hasImages: true },
    { name: 'products', hasImages: true },
    { name: 'product_details', hasImages: false },
    { name: 'blogPosts', hasImages: true },
    { name: 'contacts', hasImages: false },
    { name: 'newsletterSubscriptions', hasImages: false },
    { name: 'settings', hasImages: false }
  ];

  try {
    for (const colInfo of collectionsToMigrate) {
      console.log(`\n📦 Processing collection: [${colInfo.name}]...`);
      const snapshot = await firestore.collection(colInfo.name).get();
      
      if (snapshot.empty) {
        console.log(`ℹ️ Collection [${colInfo.name}] has no documents. Skipping.`);
        continue;
      }

      console.log(`Found ${snapshot.size} documents to migrate.`);
      const mongoCol = db.collection(colInfo.name);

      for (const doc of snapshot.docs) {
        const data = doc.data();
        const recordId = doc.id;
        console.log(`Processing document ID: ${recordId}...`);
        
        let migratedData = { ...data, id: recordId, _id: recordId };

        // Convert timestamps to JS Dates
        for (const key in migratedData) {
          if (migratedData[key] && typeof migratedData[key].toDate === 'function') {
            migratedData[key] = migratedData[key].toDate();
          }
        }

        // Migrate images if collection contains them
        if (colInfo.hasImages) {
          if (colInfo.name === 'categories' && migratedData.image) {
            migratedData.image = await migrateImageField(migratedData.image, 'categories');
          } 
          else if (colInfo.name === 'products') {
            if (migratedData.image) {
              migratedData.image = await migrateImageField(migratedData.image, 'products');
            }
            if (Array.isArray(migratedData.detailImages)) {
              const newDetailImages = [];
              for (const img of migratedData.detailImages) {
                const migratedImg = await migrateImageField(img, 'products/details');
                if (migratedImg) newDetailImages.push(migratedImg);
              }
              migratedData.detailImages = newDetailImages;
            }
          }
          else if (colInfo.name === 'blogPosts' && migratedData.image) {
            migratedData.image = await migrateImageField(migratedData.image, 'blog');
          }
        }

        // Upsert record into MongoDB
        await mongoCol.replaceOne({ _id: recordId }, migratedData, { upsert: true });
        console.log(`✅ Document ID: ${recordId} migrated and saved to MongoDB.`);
      }
      console.log(`✅ Collection [${colInfo.name}] migration complete.`);
    }

    console.log('\n🎉 ALL DATA MIGRATION TASKS COMPLETED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Migration failed with error:', error);
  } finally {
    await mongoClient.close();
    console.log('🔌 MongoDB connection closed.');
  }
}

runMigration().catch(console.error);
