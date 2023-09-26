import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized";
import { useAppSelector } from "@/redux/hooks";
import { Outlet } from "react-router-dom";



// :: Allowed roles
const ALLOWED_ROLES = [103]


function AuthSales() {

  // + get auth state
  const currentUser = useAppSelector(selectCurrentUser)

  if (currentUser?.roles.some(role => ALLOWED_ROLES.includes(role))) {
    return <Outlet />
  } else {
    return <UnAuthorized />
    // TODO: show content why un-authorized
  }
}



export default AuthSales