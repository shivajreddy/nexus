import {fetchBaseQuery} from "@reduxjs/toolkit/dist/query/react";
import {createApi} from "@reduxjs/toolkit/query/react";
import {BASE_URL, PUBLIC_DATA_DEPARTMENTS,} from "@/services/api";


const eagleDataAPI = createApi({
    reducerPath: 'eagleDataAPI',
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL}),
    endpoints: (builder) => ({
        getAllDepartments: builder.query<[string], undefined>({
            query: () => PUBLIC_DATA_DEPARTMENTS
        })
    }),
});


export const {
    useGetAllDepartmentsQuery
} = eagleDataAPI;

export default eagleDataAPI;