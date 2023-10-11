import {Popover, PopoverContent, PopoverTrigger} from "@components/ui/popover.tsx";
import {Button} from "@components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@components/ui/calendar.tsx";
import {useState} from "react";
import {Label} from "@components/ui/label.tsx";
import {Input} from "@components/ui/input.tsx";

interface Iprops {
    id: string;
    name: string;
}

const FieldDate = (props: Iprops) => {
    const [date, setDate] = useState<Date | undefined>(new Date());
    return (
        <div className="flex items-center">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1" id={props.id}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"inverted"}
                            className={cn(
                                "justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    );
};


export default FieldDate;