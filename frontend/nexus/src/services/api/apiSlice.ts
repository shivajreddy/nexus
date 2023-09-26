import {BaseQueryFn, FetchArgs, createApi, fetchBaseQuery, FetchBaseQueryError} from "@reduxjs/toolkit/query/react";
import {setAuthState, removeAuthState} from "@/features/auth/authSlice";
import {RootState} from "@/redux/store";
import {BASE_URL, REFRESH_ENDPOINT} from ".";


/*
 :: Service -> ApiSlice
 + 1. This creates the reducer using the `createApi` from redux/toolkit/query/react
 + 2. Create a baseQuery that includes accessToken as the bearer token in the header of every request
 + 3. This query, if failed will automatically send another request to refresh endpoint
 +      1. if success, then grab the accessToken from response, retry request with new accessToken
 +      2. if failed, remove authState from store, dont send request again.
 + 4. No endpoints are defined here, other slices will extend this apiSlice to attach endpoints.
*/


const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
    prepareHeaders: (headers, {getState}) => {
        const accessToken = (getState() as RootState).auth.accessToken;
        if (accessToken) {
            headers.set("authorization", `Bearer ${accessToken}`);
        }
        return headers;
    },
});


// * https://redux-toolkit.js.org/rtk-query/usage/customizing-queries
const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {  // + if the baseQuery's response is 404 i.e., expired AccessToken

        const refreshResult = await baseQuery(REFRESH_ENDPOINT, api, extraOptions);

        if (refreshResult.data) {
            const user = (api.getState() as RootState).auth.user;
            // + store the new token
            api.dispatch(setAuthState({...refreshResult.data, user}));

            // + retry the original query with the new access token
            result = await baseQuery(args, api, extraOptions);

        } else {
            api.dispatch(removeAuthState());
        }
    }

    return result;
};


const serverAPI = createApi({
    reducerPath: 'serverApi',
    tagTypes: ["Auth"],
    baseQuery: baseQueryWithReauth,
    endpoints: () => ({}),
});


export default serverAPI;
