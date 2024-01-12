import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID,
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
  }),
});

const db = getFirestore();

export const userRef = db.collection('user');
export const addressRef = db.collection('address');
export const userReviewRef = db.collection('userReview');

export const productRef = db.collection('product');
export const productCategoryRef = db.collection('productCategory');
export const productReviewRef = db.collection('productReview');

export const storeRef = db.collection('store');
export const transactionRef = db.collection('transaction')
export const chatRef = db.collection('chat');
export const categoryRef = db.collection('category');

export default db;
