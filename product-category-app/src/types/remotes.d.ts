declare module 'shopping_dashboard/store' {
  import { Store } from '@reduxjs/toolkit';
  
  export const store: Store;
  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
}

