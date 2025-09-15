import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";


// :: Allowed roles
// const ALLOWED_ROLES = [210, 211, 213, 291, 299, 999];
const ALLOWED_ROLES = [999];


function AuthPipeline() {

    // Get auth state
    const currentUser = useAppSelector(selectCurrentUser)
    // console.log("currentUser:", currentUser);

    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {
        return <Outlet />
    }
}


export default AuthPipeline;
