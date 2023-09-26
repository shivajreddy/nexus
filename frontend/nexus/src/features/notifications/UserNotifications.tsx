import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { IoNotificationsOutline } from "react-icons/io5"
import Notification from "./Notification"
import { Separator } from "@/components/ui/separator"


interface IProps { }

function UserNotifications({ ...props }: IProps) {
  return (
    <div className="user-notifications-container">

      <Sheet>
        <SheetTrigger asChild>
          <div> <IoNotificationsOutline /> </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="font-bold text-2xl">Notifications</SheetTitle>
          </SheetHeader>
          <Separator />
          <br />

          <div className="all-notifications">
            <Notification />
          </div>

        </SheetContent>
      </Sheet>

    </div>
  )
}

export default UserNotifications