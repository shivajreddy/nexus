import MainLayout from "@/templates/MainLayout";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
// import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
// import UserPlaceholderDp from '@images/user/placeholder-dp.png'

import "@assets/pages/User/userhome.css";
// import ThemeToggle from "@/features/themes/ThemeToggle.tsx";
import {removeAuthState, selectCurrentUser} from "@/features/auth/authSlice";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {useLazyLogoutQuery} from "@/features/auth/authApiSlice.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";

function UserHome() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector(selectCurrentUser)
    // console.log("user::=", user);

    const [lazyLogoutTrigger] = useLazyLogoutQuery(undefined);

    const handleLogout = () => {
        dispatch(removeAuthState());  // + remove auth state
        lazyLogoutTrigger(undefined);
        navigate('/welcome')
    }

    return (
        <MainLayout>
            <div className="m-4 bg-default-bg1 rounded-md p-8">
                <div className="flex">
                    {/*<Avatar className="w-24 h-24">*/}
                    {/*    <AvatarImage src={UserPlaceholderDp}/>*/}
                    {/*    <AvatarFallback>???</AvatarFallback>*/}
                    {/*</Avatar>*/}
                    <div className="user-page-header flex items-baseline">
                        <p className="font-extrabold text-4xl"> {user?.user_info.first_name}</p>
                        <p className="font-extrabold text-4xl">&nbsp; {user?.user_info.last_name}</p>
                        <p className="font-bold text-2xl ">,&nbsp; {user?.user_info.job_title}</p>
                    </div>
                </div>

                <div className="flex my-4">
                    <Card className="w-[400px]">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input id="first_name" disabled type="text"
                                           defaultValue={user?.user_info.first_name}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input id="last_name" disabled type="text"
                                           defaultValue={user?.user_info.last_name}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="job-title">Title</Label>
                                    <Input id="job-title" type="text" disabled
                                           defaultValue={user?.user_info.job_title}/>
                                </div>
                                {/*used to show the department of the current user*/}
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="department">Department</Label>
                                    <Input id="department" type="text" disabled
                                           defaultValue={user?.user_info.department}/>
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="Teams">Team(s)</Label>
                                    <Input id="teams" type="text" disabled
                                           defaultValue={user?.user_info.teams}/>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {/*<Button variant="primary">Update</Button>*/}
                        </CardFooter>
                    </Card>
                    {/*<ThemeToggle/>*/}
                </div>
                <Button variant="destructive" onClick={handleLogout}>Logout</Button>
            </div>
        </MainLayout>
    );
}

export default UserHome;
