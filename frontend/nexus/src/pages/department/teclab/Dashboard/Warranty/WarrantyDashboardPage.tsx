import MainLayout from "@/templates/MainLayout"
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized"
import WarrantyCard from "./WarrantyCard";

function WarrantyDashboardPage() {

    // Get auth state & Authenticate based on the allowed roles
    const currentUser = useAppSelector(selectCurrentUser)
    const ALLOWED_ROLES = [220, 221, 223, 291, 299, 600, 999]

    // Make a

    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {

        return (
            <MainLayout>
                <div className="container bg-slate-500">
                    <p className="p-4 text-center">WARRANTY DASHBOARD PAGE</p>
                    <WarrantyCard />
                </div>
            </MainLayout>
        )
    }
}

export default WarrantyDashboardPage
