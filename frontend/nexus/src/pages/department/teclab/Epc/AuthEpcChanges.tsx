import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";


// :: Allowed roles
const ALLOWED_ROLES = [211, 213, 291, 299, 999]

function AuthEpcChanges() {

    // Get auth state
    const currentUser = useAppSelector(selectCurrentUser)
    // console.log("currentUser:", currentUser);

    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {
        return <Outlet />
    }
}


export default AuthEpcChanges 
