import {useAppSelector} from "@/redux/hooks";
import {selectAuthState} from "@/features/auth/authSlice";
import {Navigate, Outlet, useLocation} from "react-router-dom";


/*
  :: Checks authState
*/

const AuthRequired = () => {
    const authState = useAppSelector(selectAuthState);
    const location = useLocation();
    return (
        // + if authState is incomplete, send to login, remember current page
        authState.accessToken ?
            <Outlet/>
            : <Navigate to="/login" state={{from: location}} replace/>
    )
}


export default AuthRequired;