/**
 * Firebase Data Service for Customer-Facing Website
 * 
 * This service fetches data from Firebase Firestore for displaying
 * on the main customer-facing website. All operations are read-only
 * from the frontend. Data is managed through the admin dashboard.
 */

import { 
  collection, 
  getDocs, 
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Promotion, Review } from '@/types';

// Flag to use Firebase or local data
const USE_FIREBASE = false; // Set to true when Firebase is set up

/**
 * Get all products from Firestore
 */
export const getProductsFromFirebase = async (): Promise<Product[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products from Firebase:', error);
    return [];
  }
};

/**
 * Get products by category
 */
export const getProductsByCategoryFromFirebase = async (category: string): Promise<Product[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    const q = query(collection(db, 'products'), where('category', '==', category));
    const productsSnapshot = await getDocs(q);
    return productsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Product));
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

/**
 * Get active promotions
 */
export const getActivePromotionsFromFirebase = async (): Promise<Promotion[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    const now = new Date().toISOString();
    const q = query(
      collection(db, 'promotions'),
      where('validUntil', '>', now)
    );
    const promotionsSnapshot = await getDocs(q);
    return promotionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Promotion));
  } catch (error) {
    console.error('Error fetching promotions from Firebase:', error);
    return [];
  }
};

/**
 * Get verified reviews
 */
export const getVerifiedReviewsFromFirebase = async (): Promise<Review[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    const q = query(
      collection(db, 'reviews'),
      where('verified', '==', true),
      orderBy('date', 'desc')
    );
    const reviewsSnapshot = await getDocs(q);
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('Error fetching reviews from Firebase:', error);
    return [];
  }
};

/**
 * Get reviews for a specific product
 */
export const getProductReviewsFromFirebase = async (productId: string): Promise<Review[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', productId),
      where('verified', '==', true),
      orderBy('date', 'desc')
    );
    const reviewsSnapshot = await getDocs(q);
    return reviewsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Review));
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
};

/**
 * Submit a new review (will be pending until approved by admin)
 */
export const submitReview = async (reviewData: Omit<Review, 'id' | 'verified'>): Promise<boolean> => {
  if (!USE_FIREBASE) {
    console.log('Firebase not enabled - review not submitted');
    return false;
  }
  
  try {
    const review = {
      ...reviewData,
      verified: false,
      date: new Date().toISOString()
    };
    
    // Note: In production, you'd use addDoc here
    // For now, we'll just log it
    console.log('Review submitted:', review);
    return true;
  } catch (error) {
    console.error('Error submitting review:', error);
    return false;
  }
};
