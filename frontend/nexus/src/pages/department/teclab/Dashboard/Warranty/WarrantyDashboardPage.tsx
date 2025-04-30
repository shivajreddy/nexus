import MainLayout from "@/templates/MainLayout"
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized"

function WarrantyDashboardPage() {

    // Get auth state & Authenticate based on the allowed roles
    const currentUser = useAppSelector(selectCurrentUser)
    const ALLOWED_ROLES = [220, 221, 223, 291, 299, 600, 999]

    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {

        return (
            <MainLayout>
                <p>Warranty Dashboard Page</p>
            </MainLayout>
        )
    }
}

export default WarrantyDashboardPage
