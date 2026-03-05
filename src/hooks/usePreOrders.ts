import { useCallback } from 'react';
import type { PreOrder } from '@/types';
import { submitPreOrder, getPreOrdersByPhoneFromFirebase } from '@/lib/firebaseService';

export function usePreOrders() {
  const addPreOrder = useCallback(async (preOrder: Omit<PreOrder, 'id' | 'date' | 'status'>) => {
    const orderId = await submitPreOrder(preOrder);
    if (!orderId) throw new Error('Failed to submit pre-order to Firestore');
    
    return {
      ...preOrder,
      id: orderId,
      date: new Date().toISOString(),
      status: 'pending' as const
    };
  }, []);

  const getPreOrdersByPhone = useCallback(async (phone: string) => {
    return await getPreOrdersByPhoneFromFirebase(phone);
  }, []);

  return {
    addPreOrder,
    getPreOrdersByPhone
  };
}
