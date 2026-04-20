import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeReducer from "@/features/themes/themeSlice";

const rootReducer = combineReducers({
  theme: themeReducer,
});

export function makeStore() {
  return configureStore({
    reducer: rootReducer,
  });
}

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];