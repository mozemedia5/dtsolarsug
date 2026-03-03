import { useState, useEffect } from 'react';
import { getProductsFromFirebase, getActivePromotionsFromFirebase } from '@/lib/firebaseService';
import type { Product, Promotion } from '@/types';

/**
 * Hook to fetch products from Firebase
 */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const data = await getProductsFromFirebase();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}

/**
 * Hook to fetch active promotions from Firebase
 */
export function usePromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPromotions() {
      try {
        setLoading(true);
        const data = await getActivePromotionsFromFirebase();
        setPromotions(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching promotions:', err);
        setError('Failed to load promotions');
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPromotions();
  }, []);

  return { promotions, loading, error };
}

/**
 * Hook to fetch featured products from Firebase
 */
export function useFeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        setLoading(true);
        const data = await getProductsFromFirebase();
        // Filter products with rating >= 4.7 (same as mock data logic)
        const featured = data.filter(product => (product.rating || 0) >= 4.7).slice(0, 6);
        setFeaturedProducts(featured);
        setError(null);
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products');
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return { featuredProducts, loading, error };
}

/**
 * Helper functions for product filtering
 */
export function getProductsByCategory(products: Product[], category: string): Product[] {
  return products.filter(product => product.category === category);
}

export function getProductById(products: Product[], id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export const categoryLabels: Record<string, string> = {
  'solar-kits': 'Solar Kits',
  'batteries-inverters': 'Batteries & Inverters',
  'cctv-cameras': 'CCTV Cameras',
  'water-pumps': 'Water Pumps & Heaters',
  'home-electronics': 'Home Electronics'
};
