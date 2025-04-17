import MainLayout from "@/templates/MainLayout"
import "./dashboard.css"
import Ticker from "./Ticker"
import DashboardCarousel from "./DashboardCarousel"
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import UnAuthorized from "@/pages/common/UnAuthorized"

function DashboardPage() {

    // Get auth state & Authenticate based on the allowed roles
    const currentUser = useAppSelector(selectCurrentUser)
    const ALLOWED_ROLES = [220, 221, 223, 291, 299, 600, 999]

    if (!(currentUser?.security?.roles.some(role => ALLOWED_ROLES.includes(role)))) {
        return <UnAuthorized />
    } else {

        return (
            <MainLayout>

                <Ticker />

                <DashboardCarousel />

                {/* <div className="p-5"> */}
                {/*     <div className="bg-default-bg1 rounded-lg p-4 m-4"> */}
                {/*         <div className="rounded-lg flex flex-wrap justify-center"> */}
                {/*             <County_1 /> */}
                {/*             <County_2 /> */}
                {/*         </div> */}
                {/*         <p className="text-center text-2xl">County</p> */}
                {/*     </div> */}
                {/* </div> */}

            </MainLayout>
        )
    }
}

export default DashboardPage
