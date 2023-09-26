import {selectCurrentUser} from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import {useAppSelector} from "@/redux/hooks";
import {Outlet} from "react-router-dom";


// :: Allowed roles
const ALLOWED_ROLES = [101]


function AuthTecLab() {

    // return <Outlet />
    // // + get auth state
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser?.roles.some(role => ALLOWED_ROLES.includes(role))) {
        return <Outlet/>
    } else {
        return <UnAuthorized/>
    }
}


export default AuthTecLab