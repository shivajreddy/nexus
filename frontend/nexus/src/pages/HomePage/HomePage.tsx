import MainLayout from "@/templates/MainLayout"
import {Button} from "@components/ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {selectCurrentUser} from "@/features/auth/authSlice.ts";
import {useAppSelector} from "@redux/hooks.ts";

function HomePage() {

    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser)
    console.log("user::::=", user);

    // get the user details

    return (
        <MainLayout>
            <div className="home-page rounded-md p-4 bg-default-bg1 border-2 border-b0 min-h-[calc(100vh-105px)]">

                <div className="px-4 flex flex-col border-2 border-red-600 min-h-[calc(100vh-120px)]">
                    <div className="grow">
                        <p className="text-4xl font-bold text-center py-4">👋 Hello {user?.user_info.first_name}</p>

                        <p className="text-2xl font-semibold">Your ToDo:</p>
                        <p>✅ Drafting | RB-5-33</p>
                        <p>⬜ Drafting | RB-5-06</p>
                    </div>

                    <p> Check out Nexus's
                        <Button className="p-0 px-1" variant="link"
                                onClick={() => navigate('/welcome')}>timeline</Button>
                    </p>
                </div>
            </div>
            <br/>
        </MainLayout>
    )
}

export default HomePage