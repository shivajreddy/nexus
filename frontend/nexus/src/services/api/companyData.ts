import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {BASE_URL} from "@/services/api/index.ts";
import {createApi} from "@reduxjs/toolkit/query/react";

const companyDataAPI = createApi({
    reducerPath: 'companyDataAPI',
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getAllDepartments: builder.query<[string], undefined>({
            query: () => '/company/departments'
        })
    }),
});

const testAPI = createApi({

    reducerPath: 'testAPI',
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getTestData: builder.query<ServerResponseScheme, undefined>({
            query: () => '/test',
        }),

        doLogin: builder.mutation<ILoginResponse, ICredentials>({
            query: (creds) => ({
                url: "/auth/login",
                method: "POST",
                body: `username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }),
        })

    })

})
