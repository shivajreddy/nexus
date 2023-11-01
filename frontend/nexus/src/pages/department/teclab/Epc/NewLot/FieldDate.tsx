import {Popover, PopoverContent, PopoverTrigger} from "@components/ui/popover.tsx";
import {Button} from "@components/ui/button.tsx";
import {cn} from "@/lib/utils.ts";
import {Calendar as CalendarIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@components/ui/calendar.tsx";
import {Label} from "@components/ui/label.tsx";


interface IProps {
    id: string;
    name: string;
    value?: Date;
    onUpdate: (chosenDate?: Date) => void;
}

const FieldDate = (props: IProps) => {

    return (
        <div key={props.id} className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t border-b0 ml-4"></div>
            </div>
            <div className="flex-1 flex-grow" id={props.id}>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "justify-start text-left font-semibold text-primary w-full",
                                !props.value && "text-muted-foreground font-normal w-full"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4"/>
                            {props.value ? format(props.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={props.value}
                            onSelect={(newValue) => props.onUpdate(newValue)}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    );
};


export default FieldDate;