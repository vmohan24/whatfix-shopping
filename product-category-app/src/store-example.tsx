/**
 * Example: How to use the shared Redux store in the remote app
 * 
 * This file demonstrates how to access the Redux store from the host app
 * in your remote app components.
 */

import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'shopping_dashboard/store';

// Example component using the shared store
export const ExampleComponent = () => {
  // Use typed hooks to access the store
  const someState = useSelector((state: RootState) => state);
  const dispatch = useDispatch();

  // Example: Access a specific slice (uncomment when you add slices)
  // const cartItems = useSelector((state: RootState) => state.cart.items);
  // const user = useSelector((state: RootState) => state.user);

  return (
    <div>
      {/* Your component JSX */}
      <p>Store state: {JSON.stringify(someState)}</p>
    </div>
  );
};

/**
 * Alternative: Create typed hooks in the remote app
 * 
 * Create a hooks file similar to the host app:
 * 
 * import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
 * import type { RootState, AppDispatch } from 'shopping_dashboard/store';
 * 
 * export const useAppDispatch = () => useDispatch<AppDispatch>();
 * export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
 * 
 * Then use in components:
 * const cartItems = useAppSelector(state => state.cart.items);
 * const dispatch = useAppDispatch();
 */

