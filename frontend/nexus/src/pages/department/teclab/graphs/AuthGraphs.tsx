import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";


// :: Allowed roles
const ALLOWED_ROLES = [999] // underdevelopment
// const ALLOWED_ROLES = [299, 600, 999]


function AuthGraphs() {

    // // + get auth state
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role))) {
        return <Outlet />
    } else {
        return <UnAuthorized />
    }
}


export default AuthGraphs
