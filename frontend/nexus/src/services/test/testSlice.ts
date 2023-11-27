import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";


const BASE_URL = "http://localhost:8000"

type ServerResponseScheme = {
    result: string;
}


// interface ILoginResponse {
//   status: string;
//   access_token: string;
//   roles: [number];
//   username: string;
//   department: string;
//   team: string;
// }

interface ICredentials {
    username: string;
    password: string;
}

const testAPI = createApi({

    reducerPath: 'testAPI',
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getTestData: builder.query<ServerResponseScheme, undefined>({
            // query: () => '/test',
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


export const {useGetTestDataQuery, useDoLoginMutation} = testAPI;
export default testAPI;