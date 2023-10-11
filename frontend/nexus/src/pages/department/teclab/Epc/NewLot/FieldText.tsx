import {Input} from '@/components/ui/input'
import {Label} from "@components/ui/label.tsx";

interface IProps {
    id: string;
    name: string;
    placeholder?: string;
}

const FieldText = (props: IProps) => {
    return (
        <div className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1 cursor-pointer">
                <Input className="" id={props.id} type="string" placeholder={props.placeholder}/>
            </div>
        </div>
    );
};


export default FieldText;