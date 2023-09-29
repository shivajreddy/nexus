import MainLayout from "@/templates/MainLayout";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

import "@assets/pages/User/userhome.css";
import ThemeToggle from "@/features/themes/ThemeToggle.tsx";
import {removeAuthState} from "@/features/auth/authSlice";
import {useAppDispatch} from "@/redux/hooks";
import {useLazyLogoutQuery} from "@/features/auth/authApiSlice.ts";
import {useNavigate} from "react-router-dom";

function UserHome() {
    // Request for user details
    const defaultName = "John Doe";
    const defaultJobTitle = "Eagle employee";
    const defaultEmail = "jdoe@eagleofva.com";

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [lazyLogoutTrigger] = useLazyLogoutQuery(undefined);

    const handleLogout = () => {
        dispatch(removeAuthState());  // + remove auth state
        lazyLogoutTrigger(undefined);
        navigate('/welcome')
    }

    return (
        <MainLayout>
            <div className="user-page">
                <button onClick={handleLogout}>logout</button>
                <div className="user-page-header flex items-baseline ml-8">
                    <p className="font-extrabold text-6xl">{defaultName},</p>
                    <p className="font-bold text-4xl pl-4"> {defaultJobTitle}</p>
                </div>

                <div className="user-page-container">
                    <Card className="w-[400px] mx-4">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" type="text" defaultValue={defaultName}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="job-title">Title</Label>
                                    <Input
                                        id="job-title"
                                        type="text"
                                        defaultValue={defaultJobTitle}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="email">Title</Label>
                                    <Input id="email" type="email" defaultValue={defaultEmail}/>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <ThemeToggle/>

                    <Avatar className="w-60 h-60">
                        <AvatarImage src="https://github.com/shadcn.png"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </MainLayout>
    );
}

export default UserHome;
