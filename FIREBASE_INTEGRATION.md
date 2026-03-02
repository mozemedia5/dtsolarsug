# Firebase Integration Guide - Main Branch

This guide explains how to integrate the main customer-facing website with the Firebase backend managed by the admin dashboard.

## Current Status

✅ Firebase SDK installed  
✅ Firebase configuration added (`.env` file)  
✅ Firebase service layer created  
⏳ Integration with existing components (optional)

## How It Works

The admin dashboard (on the `admin` branch) manages all data in Firebase Firestore:
- Products
- Promotions  
- Reviews

The main branch (customer website) can fetch this data in real-time from Firebase instead of using local TypeScript files.

## Option 1: Keep Using Local Data (Current Setup)

**Status:** ✅ Active (default)

The website currently uses local data from `src/data/` files:
- `products.ts`
- `promotions.ts`
- `reviews.ts`

**Pros:**
- No external dependencies
- Fast loading (no network requests)
- Works offline
- Simple to maintain

**Cons:**
- Data must be updated manually in code
- No real-time updates from admin dashboard
- Requires code deployment for content changes

## Option 2: Fetch Data from Firebase (Optional)

**Status:** ⏳ Available but not activated

To switch to Firebase:

### Step 1: Enable Firebase in the Service

Edit `src/lib/firebaseService.ts`:

```typescript
// Change this line from false to true
const USE_FIREBASE = true;
```

### Step 2: Update Data Imports

In components that import from `src/data/`, change to use Firebase service:

**Before:**
```typescript
import { products } from '@/data/products';
```

**After:**
```typescript
import { getProductsFromFirebase } from '@/lib/firebaseService';

// In component:
const [products, setProducts] = useState<Product[]>([]);

useEffect(() => {
  const loadProducts = async () => {
    const data = await getProductsFromFirebase();
    setProducts(data);
  };
  loadProducts();
}, []);
```

### Step 3: Update Affected Components

Components that would need updates:
- `src/pages/Products.tsx`
- `src/pages/Home.tsx` (for featured products)
- `src/pages/Reviews.tsx`
- Any component displaying promotions

## Hybrid Approach (Recommended)

Use Firebase for dynamic content and local data as fallback:

```typescript
import { products as localProducts } from '@/data/products';
import { getProductsFromFirebase } from '@/lib/firebaseService';

const [products, setProducts] = useState<Product[]>(localProducts);

useEffect(() => {
  const loadProducts = async () => {
    const firebaseData = await getProductsFromFirebase();
    if (firebaseData.length > 0) {
      setProducts(firebaseData);
    }
  };
  loadProducts();
}, []);
```

This approach:
- Shows local data immediately (fast initial load)
- Updates with Firebase data when available
- Falls back to local data if Firebase fails

## Firebase Service API

### Products

```typescript
// Get all products
const products = await getProductsFromFirebase();

// Get products by category
const solarKits = await getProductsByCategoryFromFirebase('solar-kits');
```

### Promotions

```typescript
// Get active promotions only
const promotions = await getActivePromotionsFromFirebase();
```

### Reviews

```typescript
// Get all verified reviews
const reviews = await getVerifiedReviewsFromFirebase();

// Get reviews for specific product
const productReviews = await getProductReviewsFromFirebase('product-id');

// Submit new review (pending admin approval)
await submitReview({
  userName: 'John Doe',
  rating: 5,
  comment: 'Great product!',
  productId: 'solar-kit-2light',
  date: new Date().toISOString()
});
```

## Security Notes

1. **Read-only access:** The main branch only reads data. All writes go through admin dashboard.
2. **Firestore rules:** Ensure your Firestore security rules allow public read access:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /promotions/{promotionId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /reviews/{reviewId} {
      allow read: if request.resource.data.verified == true;
      allow create: if true; // Allow customers to submit reviews
      allow update, delete: if request.auth != null;
    }
  }
}
```

3. **Environment variables:** The `.env` file is not committed to git. Each deployment needs Firebase config set in environment variables.

## Deployment Considerations

### With Local Data (Current)
- Deploy as normal
- No external dependencies
- No environment variables needed

### With Firebase Integration
- Set environment variables in deployment platform:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

## Testing Firebase Integration

1. **Set up Firebase** (see admin branch README)
2. **Migrate data** using `migrate-data.ts` script
3. **Enable Firebase** in `firebaseService.ts`
4. **Test locally:**
```bash
npm run dev
```
5. **Check browser console** for Firebase connection status
6. **Verify data loads** from Firebase

## Support

For Firebase setup issues, refer to:
- `ADMIN_README.md` on admin branch
- Firebase Console error messages
- Browser developer console

---

**Current Setup:** Local data (no Firebase required)  
**Integration:** Optional (can be enabled anytime)  
**Admin Dashboard:** Separate `admin` branch with Firebase
