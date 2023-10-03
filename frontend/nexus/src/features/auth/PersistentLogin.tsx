import {Outlet} from "react-router-dom";
import useRefreshToken from "@hooks/useRefreshToken.ts";
import {useEffect, useState} from "react";
import {useAppSelector} from "@redux/hooks.ts";
import {selectAuthState} from "@/features/auth/authSlice.ts";
import LoadingSpinner from "@components/common/LoadingSpinner.tsx";


function PersistentLogin() {

    // + check for refresh token
    const authState = useAppSelector(selectAuthState);
    const refresh_fn = useRefreshToken()
    const [isLoading, setIsLoading] = useState(true);

    console.log("IN PERSISTENT-LOGIN.tsx")

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh_fn()
            } catch (err) {
                console.log("Error caught for refresh_fn in PersistentLogin")
                console.error(err)
            } finally {
                isMounted && setIsLoading(false);
            }
        }
        !authState.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        };
    }, []);

    // useEffect(() => {
    //     console.log(`isLoading: ${isLoading}`)
    //     console.log(`aT: ${JSON.stringify(authState)}`)
    // }, [isLoading])
    return (
        <>
            {isLoading ?
                <div className="flex flex-col justify-center items-center min-w-100 min-h-[100vh] border">
                    <LoadingSpinner width={50}/>
                </div>
                :
                <Outlet/>
            }
        </>
    )
}


export default PersistentLogin

