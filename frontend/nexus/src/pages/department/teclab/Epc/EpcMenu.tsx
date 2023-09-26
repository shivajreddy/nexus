import { Button } from "@components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaInfoCircle } from "react-icons/fa";

interface IProps {}

function EpcMenu({ ...props }: IProps) {
  return (
    <div style={{ position: "absolute", right: "0", bottom: "0" }}>
      <Sheet>
        <SheetTrigger>
          <div className="pl-4 pr-4 h-8 rounded-none rounded-t-lg">Menu</div>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-center items-center">
          <SheetHeader></SheetHeader>
          <p>Download current view</p>
          <div className="flex justify-center items-center">
            <Button className="w-[10rem]">Download CSV</Button>
            <Popover>
              <PopoverTrigger className="pl-2">
                <div>
                  {" "}
                  <FaInfoCircle size={"1.2rem"} />{" "}
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <p>
                  {" "}
                  To convert the CSV file into Excel file, Open the CSV file in
                  Excel.{" "}
                </p>
                <br />
                <p className="text-sm">
                  1. click <b>File</b>&rarr; <b>Save as</b> <br />
                  2. Browse for the folder where you want to save the file.
                  <br />
                  3. Select Excel Workbook <b>(*.xlsx)</b> from the Save as type
                  drop-down menu.
                </p>
              </PopoverContent>
            </Popover>
          </div>

          <Separator />

          <p>View Settings</p>
          <div>
            <Button className="w-[10rem]">Update: My View</Button>
            <Popover>
              <PopoverTrigger className="pl-2">
                <div>
                  {" "}
                  <FaInfoCircle size={"1.2rem"} />{" "}
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
                  {" "}
                  <FaInfoCircle size={"1.2rem"} />{" "}
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
                  {" "}
                  <FaInfoCircle size={"1.2rem"} />{" "}
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
