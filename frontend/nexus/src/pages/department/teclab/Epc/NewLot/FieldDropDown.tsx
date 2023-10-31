import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@components/ui/select.tsx";
import {Label} from "@components/ui/label.tsx";


interface IProps {
    id: string;
    name: string;
    dropdownData: string[];
    value?: string;
    onUpdate: (chosenString: string) => void;
}


const FieldDropDown = (props: IProps) => {
    console.log("all props at FieldDropDown=", props);

    return (
        <div key={props.id} className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer">{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1 text-primary">
                <Select value={props.value} onValueChange={(selectedValue)=>props.onUpdate(selectedValue)}>
                    <SelectTrigger>
                        <SelectValue placeholder={"choose"} />
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
