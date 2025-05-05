// import {Button} from "@components/ui/button.tsx";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@components/ui/sheet.tsx";
import { Separator } from "@components/ui/separator.tsx";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@components/ui/popover.tsx";
// import {FaInfoCircle} from "react-icons/fa";
import { MdEmail, MdOutlineStorage } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CgMenuGridO } from "react-icons/cg";
import { Button } from "@components/ui/button.tsx";
import { BASE_URL, FOSC_URL } from "@/services/api";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import { hasRoles } from "@/features/utils/utils.ts";
import { useUserRoles } from "@hooks/useUserRoles.ts";


function FoscMenu() {
    const navigate = useNavigate();

    const axios = useAxiosPrivate();

    const userRoles = useUserRoles();

    return (
        <div style={{ position: "absolute", right: "2em" }}>
            {/*<div style={{}}>*/}

            <Sheet>
                <SheetTrigger>
                    <div className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md">
                        <p className="pr-2"><MdOutlineStorage /></p>
                        Menu
                    </div>
                </SheetTrigger>
                <SheetContent className="flex flex-col justify-center items-center">
                    <SheetHeader>Menu</SheetHeader>
                    <Separator />

                    {/*list of all current lots that need to be done*/}
                    <div className="flex justify-center items-center ml-8 bg-default-bg2">
                        <button
                            className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md"
                            onClick={() => navigate('/fosc/current')}
                        >
                            <p className="pr-2"><CgMenuGridO /></p>
                            Current Lots
                        </button>
                    </div>
                    {/*List of the summaries fo all communities*/}
                    <div className="flex justify-center items-center ml-8 bg-default-bg2">
                        <button
                            className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md"
                            onClick={() => navigate('/fosc/summary')}
                        >
                            <p className="pr-2"><CgMenuGridO /></p>
                            Summary Page
                        </button>
                    </div>
                    {/*List of all of the lots that exist and their status*/}
                    {hasRoles(userRoles, [223, 299, 999]) &&
                        <div className="flex justify-center items-center ml-8 bg-default-bg2">
                            <button
                                className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md"
                                onClick={() => navigate('/fosc/all-lots')}
                            >
                                <p className="pr-2"><CgMenuGridO /></p>
                                All Lots
                            </button>
                        </div>
                    }
                    <Separator />
                    <p>Tracker Emails</p>

                    {hasRoles(userRoles, [223, 299, 999]) &&
                        <div className="flex justify-center items-center bg-default-bg1 mx-4">
                            <Button
                                onClick={() => axios.get(BASE_URL + '/department/teclab/fosc/fosc-summary-tracker')}
                                className="min-w-[10em]">
                                <p className="pr-2"><MdEmail /></p>
                                Summary Page
                            </Button>
                        </div>
                    }

                    {hasRoles(userRoles, [223, 299, 999]) &&
                        <div className="flex justify-center items-center bg-default-bg1 mx-4">
                            <Button
                                onClick={() => axios.get(BASE_URL + '/department/teclab/fosc/fosc-live-tracker')}
                                className="min-w-[10em]">
                                <p className="pr-2"><MdEmail /></p>
                                Live-Lots Page
                            </Button>
                        </div>
                    }

                    {hasRoles(userRoles, [223, 299, 999]) &&
                        <div className="flex justify-center items-center bg-default-bg1 mx-4">
                            <Button
                                onClick={() => axios.get(BASE_URL + '/department/teclab/fosc/fosc-all-tracker')}
                                className="min-w-[10em]">
                                <p className="pr-2"><MdEmail /></p>
                                All-Lots Page
                            </Button>
                        </div>
                    }

                </SheetContent>
            </Sheet>
        </div>
    );
}

export default FoscMenu;
