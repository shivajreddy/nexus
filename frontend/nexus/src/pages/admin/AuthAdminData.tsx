import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";

const ALLOWED_ROLES = [101, 999];

function AuthAdminData() {
    const currentUser = useAppSelector(selectCurrentUser);

    if (currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role))) {
        return <Outlet />;
    } else {
        return <UnAuthorized />;
    }
}

export default AuthAdminData;
