import MainLayout from "@/templates/MainLayout";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import UserPlaceholderDp from '@images/user/placeholder-dp.png'

import "@assets/pages/User/userhome.css";
import ThemeToggle from "@/features/themes/ThemeToggle.tsx";
import {removeAuthState} from "@/features/auth/authSlice";
import {useAppDispatch} from "@/redux/hooks";
import {useLazyLogoutQuery} from "@/features/auth/authApiSlice.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";

function UserHome() {
    // Request for user details
    const defaultName = "Eric Eagle";
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
            <div className="user-page m-4">
                <div className="flex">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={UserPlaceholderDp}/>
                        <AvatarFallback>???</AvatarFallback>
                    </Avatar>
                    <div className="user-page-header flex flex-col ml-8">
                        <p className="font-extrabold text-6xl"> {defaultName}</p>
                        <p className="font-bold text-4xl "> {defaultJobTitle}</p>
                    </div>
                </div>

                <div className="user-page-container">
                    <Card className="w-[400px]">
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
                        <CardFooter>
                            <Button variant="primary">Update</Button>
                        </CardFooter>
                    </Card>
                    {/*<ThemeToggle/>*/}
                    <Button onClick={()=>navigate('/updates')}>
                        Updates
                    </Button>
                </div>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
        </MainLayout>
    );
}

export default UserHome;
