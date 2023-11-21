import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@components/ui/select.tsx";
import {Label} from "@components/ui/label.tsx";
import {cn} from "@/lib/utils.ts";


interface IProps {
    id: string;
    name: string;
    dropdownData: string[];
    value?: string;
    onUpdate: (newValue: string) => void;
    className?: string | undefined;
    disabled?: boolean;
}


const FieldDropDown = (props: IProps) => {
    return (
        <div key={props.id} className={cn("flex items-center py-2", props.className)}>
            {/*<div className="flex-1 flex flex-grow items-center">*/}
            <div className="basis-1/3 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer">{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            {/*<div className="flex-1 w-[26rem] text-primary font-semibold">*/}
            {/*<div className="basis-2/3 text-primary font-semibold">*/}
                <div className={`basis-2/3 font-semibold  ${props.disabled ? "pointer-events-none text-default-fg1" : "text-primary"}`} >
                <Select value={props.value} onValueChange={(newValue)=>props.onUpdate(newValue)}>
                    <SelectTrigger >
                        <SelectValue placeholder={""} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className="max-h-40 overflow-y-scroll">
                            {props.dropdownData.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FieldDropDown;
