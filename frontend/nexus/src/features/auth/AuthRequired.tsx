import {useAppSelector} from "@/redux/hooks";
import {selectAuthState} from "@/features/auth/authSlice";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";


/*
  :: Checks authState
*/

// const AuthRequired = () => {
//     const authState = useAppSelector(selectAuthState);
//     const location = useLocation();
//     console.log("in AuthRequired, authState:", authState)
//     return (
//         // + if authState is incomplete, send to login, remember current page
//         authState.accessToken ?
//             <Outlet/>
//             : <Navigate to="/login" state={{from: location}} replace/>
//     )
// }
const AuthRequired = () => {

    const location = useLocation();
    const authState = useAppSelector(selectAuthState);
    console.log("in AuthRequired, authState:", authState)
    return (
        // + if authState is incomplete, send to login, remember current page
        // TODO: check also authState.user
        authState.accessToken ?
            <Outlet/>
            : <Navigate to="/login" state={{from: location}} replace/>
    )


    // const [isLoading, setIsLoading] = useState(true);

    // Check if authState is initially empty
    // useEffect(() => {
    //     if (!authState.accessToken || !authState.user) {
    //         // You can add additional conditions here if needed.
    //         // For example, check if a refresh request is pending.
    //         setIsLoading(true);
    //     } else {
    //         setIsLoading(false);
    //     }
    // }, [authState]);

    // Wait for loading to complete before making a decision
    // if (isLoading) {
    //     return <p>Loading...</p>;
    // } else if (!authState.accessToken || !authState.user) {
    //     console.log("couldn't find authState, going to navigate to /login")
    //     return <Navigate to="/login" state={{from: location}} replace/>;
    // }
    // return <Outlet/>;

};


export default AuthRequired;