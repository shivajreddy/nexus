import MainLayout from "@/templates/MainLayout"
import {Button} from "@components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {selectCurrentUser} from "@/features/auth/authSlice.ts";
import {useAppSelector} from "@redux/hooks.ts";

function HomePage() {

    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser)
    console.log("user=", user);

    // get the user details

    return (
        <MainLayout>
            <div className="home-page rounded-md p-4 border-2 border-b0 min-h-[calc(100vh-105px)]">
                <p className="text-2xl"> HomePage </p>
                <Button onClick={() => navigate('/welcome')}>Go To Welcome Page</Button>

                <p>Welcome {user?.username}</p>
                <p>Your Roles</p>
            </div>
            <br/>
        </MainLayout>
    )
}

export default HomePage