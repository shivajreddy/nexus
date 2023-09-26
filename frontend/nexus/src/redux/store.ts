import {configureStore} from "@reduxjs/toolkit";
import sidebarSlice from "@/features/sidebar/sidebarSlice";

import serverAPI from "@/services/api/apiSlice";
import authSlice from "@/features/auth/authSlice";

import themeReducer from "@/features/themes/themeSlice";
import testAPI from "@/services/test/testSlice";
import eagleDataAPI from "@pages/auth/eagleApiSlice.ts";


const store = configureStore({
    reducer: {
        sidebarStatus: sidebarSlice,
        theme: themeReducer,
        auth: authSlice,

        [serverAPI.reducerPath]: serverAPI.reducer,
        [eagleDataAPI.reducerPath]: eagleDataAPI.reducer,
        [testAPI.reducerPath]: testAPI.reducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(serverAPI.middleware)
            .concat(eagleDataAPI.middleware)
            .concat(testAPI.middleware),

    devTools: true,
});


export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
