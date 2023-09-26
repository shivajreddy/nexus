import serverAPI from "@/services/api/apiSlice";
import {ICredentials, ILoginResponse, ILogoutResponse, IRefreshResponse} from "@/types";


// + this extends the `service/api/apiSlice` 
export const authApiSlice = serverAPI.injectEndpoints({

    endpoints: (builder) => ({

        // + <TypeOfResponse, TypeOfBodySentInRequest>
        login: builder.mutation<ILoginResponse, ICredentials>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                body: `username=${encodeURIComponent(credentials.username)}&password=${encodeURIComponent(credentials.password)}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }),
            // providesTags: ["Auth"]
        }),

        logout: builder.query<ILogoutResponse, undefined>({
            query: () => ({
                url: "/auth/logout",
                method: "GET",
            }),
            // invalidatesTags: ["Auth"]
        }),

        // + /refresh end point
        refresh: builder.query<IRefreshResponse, undefined>({
            query: () => ({
                url: '/auth/refresh',
                method: "GET",
            }),
            // invalidatesTags: ["Auth"]
        }),
    }),
    // overrideExisting: false,
});


export const {
    useLoginMutation,
    useLazyLogoutQuery,
    useRefreshQuery,
    useLazyRefreshQuery,
} = authApiSlice;