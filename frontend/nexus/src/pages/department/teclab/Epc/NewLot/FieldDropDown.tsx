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
    name: string;
    data: string[];
}


const FieldDropDown = (props: IProps) => {
    console.log("name=", props.name);
    console.log("data=", props.data);
    return (
        <div className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1">
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a value"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {props.data.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FieldDropDown;