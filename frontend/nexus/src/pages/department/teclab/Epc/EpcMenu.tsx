import {Button} from "@components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import {Separator} from "@components/ui/separator";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {FaInfoCircle} from "react-icons/fa";
import {MdOutlineStorage} from "react-icons/md";
import {useNavigate} from "react-router-dom";


function EpcMenu() {
    const navigate = useNavigate();
    return (
        <div style={{position: "absolute", right: "2em"}}>
            {/*<div style={{}}>*/}

            <Sheet>
                <SheetTrigger>
                    <div className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md">
                        <p className="pr-2"><MdOutlineStorage/></p>
                        Menu
                    </div>
                </SheetTrigger>
                <SheetContent className="flex flex-col justify-center items-center">
                    <SheetHeader>Menu</SheetHeader>
                    <Separator/>

                    <div>
                        <Button onClick={()=>navigate('/epc/edit-newlot-form-data')}>Edit Form Data</Button>
                    </div>

                    <p>Download current view</p>
                    <div className="flex justify-center items-center">
                        <Button className="w-[10rem]">Download CSV</Button>
                        <Popover>
                            <PopoverTrigger className="pl-2">
                                <div>
                                    <FaInfoCircle size={"1.2rem"}/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <p>
                                    To convert the CSV file into Excel file, Open the CSV file in
                                    Excel.
                                </p>
                                <br/>
                                <p className="text-sm">
                                    1. click <b>File</b>&rarr; <b>Save as</b> <br/>
                                    2. Browse for the folder where you want to save the file.
                                    <br/>
                                    3. Select Excel Workbook <b>(*.xlsx)</b> from the Save as type
                                    drop-down menu.
                                </p>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <Separator/>

                    <p>View Settings</p>
                    <div>
                        <Button className="w-[10rem]">Update: My View</Button>
                        <Popover>
                            <PopoverTrigger className="pl-2">
                                <div>
                                    <FaInfoCircle size={"1.2rem"}/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <p className="text-sm">
                                    Override <b>My View</b> configuration with the the current
                                    configuration on EPC.
                                </p>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Button className="w-[10rem]">Set: My View</Button>
                        <Popover>
                            <PopoverTrigger className="pl-2">
                                <div>
                                    <FaInfoCircle size={"1.2rem"}/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <p>
                                    Change the current view to <b>My&nbsp;View</b> configuration.
                                </p>
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div>
                        <Button className="w-[10rem]">Set: Default View</Button>
                        <Popover>
                            <PopoverTrigger className="pl-2">
                                <div>
                                    <FaInfoCircle size={"1.2rem"}/>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent>
                                <p>
                                    Change the current view to <b>Default View</b> configuration.
                                </p>
                            </PopoverContent>
                        </Popover>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}

export default EpcMenu;
