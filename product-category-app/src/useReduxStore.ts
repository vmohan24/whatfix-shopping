import { useSelector, useDispatch } from 'react-redux';
import { isStoreReady, getCartActions } from './storeUtils';

/**
 * Custom hook to safely use Redux store
 * Works in both standalone and integrated modes
 */
export const useReduxStore = () => {
  const storeAvailable = isStoreReady();
  const cartActions = getCartActions();
  
  // Always call hooks - they'll work because we always provide a store (dummy or real)
  const dispatch = useDispatch();
  const cartItems = useSelector((state: any) => state?.cart?.items || []);
  
  return {
    storeAvailable,
    dispatch,
    cartItems,
    cartActions,
  };
};

