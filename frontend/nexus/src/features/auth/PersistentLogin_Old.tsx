import {useAppDispatch, useAppSelector} from "@redux/hooks.ts";
import {selectAuthState, setAuthState} from "@/features/auth/authSlice.ts";
import {Navigate, Outlet} from "react-router-dom";
import {useEffect, useState} from "react";
import {useLazyRefreshQuery, useRefreshQuery} from "@/features/auth/authApiSlice.ts";
import {IAuthState, IUser} from "@/types";

function PersistentLogin_Old() {

    const [isLoading, setIsLoading] = useState(true);
    const authState = useAppSelector(selectAuthState);

    const dispatch = useAppDispatch();

    const [lazyRefreshQueryTrigger, {error}] = useLazyRefreshQuery(undefined);
    console.log("in PersistentLogin_Old, authState:", authState)
    useEffect(() => {
        console.log("PersistentLogin_Old: running useEffect")
        let isMounted = true;
        const invokeRefreshQuery = async () => {
            const response = await lazyRefreshQueryTrigger(undefined).unwrap();
            console.log("PersistentLogin_Old: in useEffect ->", response)
            const new_userData: IUser = {
                username: response.username,
                department: response.department,
                team: response.team,
                roles: response.roles
            }
            const new_authState: IAuthState = {
                accessToken: response.new_access_token,
                user: new_userData
            }
            dispatch(setAuthState(new_authState))
            console.log("finished updating state with:", new_authState)
            isMounted && setIsLoading(false);
        }
        !authState.accessToken ? invokeRefreshQuery() : setIsLoading(false)
        return () => {
            isMounted = false
        };
    }, [authState, dispatch, lazyRefreshQueryTrigger])

    // const {data, error} = useRefreshQuery(undefined);
    // useEffect(() => {
    //     let isMounted = true;
    //     if (data) {
    //         const new_userData: IUser = {
    //             username: data.username,
    //             department: data.department,
    //             team: data.team,
    //             roles: data.roles
    //         }
    //         const new_authState: IAuthState = {
    //             accessToken: data.new_access_token,
    //             user: new_userData
    //         }
    //         dispatch(setAuthState(new_authState))
    //         console.log("finished updating state with:", new_authState)
    //         isMounted && setIsLoading(false);
    //     }
    // }, [authState])

    useEffect(() => {
        setIsLoading(false);
    }, [isLoading])

    if (isLoading) return <p>Checking auth state...</p>
    if (error) return <Navigate to="/login" state={{from: location}} replace/>
    // if (error) navigate('/login');
    return <Outlet/>
}


export default PersistentLogin_Old