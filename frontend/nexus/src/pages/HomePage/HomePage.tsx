import MainLayout from "@/templates/MainLayout"
import {useNavigate} from "react-router-dom";
import {selectCurrentUser} from "@/features/auth/authSlice.ts";
import {useAppSelector} from "@redux/hooks.ts";

function HomePage() {

    const navigate = useNavigate();
    const user = useAppSelector(selectCurrentUser)

    return (
        <MainLayout className="relative h-screen">
            <div className="home-page rounded-md m-4 p-4 bg-default-bg1 border-2 border-b0">
                <div className="px-4 flex flex-col min-h-[calc(40vh)]">
                    <div className="grow">
                        <p className="text-4xl font-bold text-center py-4">👋 Hello {user?.user_info.first_name}</p>
                        <p className="text-2xl font-semibold">Your ToDo:</p>
                        {/*<p>✅ Drafting | RB-5-33</p>*/}
                        {/*<p>⬜ Drafting | RB-5-06</p>*/}
                        <p>✅ Drafting | xx-x-xx</p>
                        <p>✅ Home Siting | xx-x-xx</p>
                        <p>⬜ Design | xx-x-xx</p>
                        <p>⬜ Drafting | xx-x-xx</p>
                    </div>
                </div>
            </div>

            <footer className="bg-default-bg1 p-2 pt-6 absolute bottom-0 w-full">
                <span className="flex items-center justify-center pb-6">
                    <a className="px-4 text-blue-500 hover:underline hover:cursor-pointer"
                       onClick={() => navigate('/welcome')}> Timeline</a>
                    <a className="px-4 text-blue-500 hover:underline hover:cursor-pointer"
                       onClick={() => navigate('/updates')}> Design-Scheme</a>
                </span>
                <p className="text-center text-gray-400">©2023 Nexus. All Rights Reserved.</p>
            </footer>
        </MainLayout>
    )
}

export default HomePage