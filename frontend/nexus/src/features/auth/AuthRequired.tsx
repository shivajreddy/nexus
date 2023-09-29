import {useAppSelector} from "@/redux/hooks";
import {selectAuthState} from "@/features/auth/authSlice";
import {Navigate, Outlet, useLocation} from "react-router-dom";


/*
  :: Checks authState
*/

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

};


export default AuthRequired;