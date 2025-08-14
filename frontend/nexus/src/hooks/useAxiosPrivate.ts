import { useAppSelector } from "@redux/hooks.ts";
import { selectAuthState } from "@/features/auth/authSlice.ts";
import { axiosPrivate } from "@/services/axios.ts";
import { useEffect } from "react";
import useRefreshToken from "@hooks/useRefreshToken.ts";


const useAxiosPrivate = () => {

    const refresh_fn = useRefreshToken()
    const authState = useAppSelector(selectAuthState);

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${authState.accessToken}`
                }
                return config
            },
            error => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAuthState = await refresh_fn();
                    prevRequest.headers['Authorization'] = `Bearer ${newAuthState?.accessToken}`;
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [authState, refresh_fn])

    return axiosPrivate;
}

export default useAxiosPrivate;
