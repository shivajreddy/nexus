import {useAppSelector} from "@redux/hooks.ts";
import {selectAuthState} from "@/features/auth/authSlice.ts";
import {Navigate, Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import {useLazyRefreshQuery} from "@/features/auth/authApiSlice.ts";

function PersistentLogin() {

    const [isLoading, setIsLoading] = useState(true);
    const authState = useAppSelector(selectAuthState);

    const [lazyRefreshQueryTrigger, {error}] = useLazyRefreshQuery(undefined);

    useEffect(() => {
        let isMounted = true;
        const invokeRefreshQuery = async () => {
            lazyRefreshQueryTrigger(undefined);
            isMounted && setIsLoading(false);
        }
        !authState.accessToken ? invokeRefreshQuery() : setIsLoading(false)
        return () => {
            isMounted = false
        };
    }, [])

    useEffect(() => {
        setIsLoading(false);
    }, [isLoading])

    if (isLoading) return <p>Checking auth state...</p>
    if (error) return <Navigate to="/login" state={{from: location}} replace/>
    // if (error) navigate('/login');
    return <Outlet/>
}


export default PersistentLogin