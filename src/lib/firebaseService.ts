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
  getDoc,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product, Promotion, Review } from '@/types';

// Flag to use Firebase or local data
// Set to true to enable Firebase integration
const USE_FIREBASE = true; 

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
 * Fetches all promotions and filters client-side to handle both
 * date-only strings (e.g., "2025-12-31") and ISO timestamps.
 */
export const getActivePromotionsFromFirebase = async (): Promise<Promotion[]> => {
  if (!USE_FIREBASE) return [];
  
  try {
    // Fetch ALL promotions then filter client-side (avoids Firestore index issues
    // and works regardless of whether validUntil is stored as date or ISO string)
    const promotionsSnapshot = await getDocs(collection(db, 'promotions'));
    const now = new Date();
    return promotionsSnapshot.docs
      .map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as Promotion))
      .filter(promo => {
        if (!promo.validUntil) return true; // no expiry = always active
        try {
          return new Date(promo.validUntil) > now;
        } catch {
          return true;
        }
      });
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
 * Also updates the product's average rating and review count
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
    
    // Add the review to the 'reviews' collection
    await addDoc(collection(db, 'reviews'), review);

    // Update product stats if productId is provided
    if (reviewData.productId) {
      const productRef = doc(db, 'products', reviewData.productId);
      const productDoc = await getDoc(productRef);
      
      if (productDoc.exists()) {
        const productData = productDoc.data();
        const currentRating = productData.rating || 0;
        const currentReviews = productData.reviews || 0;
        
        // Calculate new average rating
        const newReviews = currentReviews + 1;
        const newRating = ((currentRating * currentReviews) + reviewData.rating) / newReviews;
        
        await updateDoc(productRef, {
          rating: newRating,
          reviews: newReviews
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error submitting review:', error);
    return false;
  }
};
