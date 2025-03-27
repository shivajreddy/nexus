import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";


const ALLOWED_ROLES = [999]


function AuthAdmin() {

    // // + get auth state
    const currentUser = useAppSelector(selectCurrentUser)
    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {
        return <Outlet />
    }
}


export default AuthAdmin
