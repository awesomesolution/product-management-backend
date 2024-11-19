import admin from 'firebase-admin';

const serviceAccount = require('./firebase-service-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET_URL,
});

const uploadImage = (imagePath: string) => {
  const bucket = admin.storage().bucket();
  return bucket.upload(imagePath);
};