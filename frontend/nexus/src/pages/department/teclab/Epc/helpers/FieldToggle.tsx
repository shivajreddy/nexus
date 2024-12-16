import {Switch} from "@components/ui/switch.tsx";
import {Label} from "@components/ui/label.tsx";

interface IProps {
    id: string;
    name: string;
    isChecked?: boolean;
    onUpdate: ()=>void;
    disabled?: boolean;
}

const FieldToggle = (props: IProps) => {

    return (
        <div className="flex items-center py-2">
            {/*<div className="flex-1 flex flex-grow items-center">*/}
            <div className="basis-1/3 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            {/*<div className="flex-1 flex items-center">*/}
            <div className={`basis-2/3 font-semibold  ${props.disabled ? "pointer-events-none text-default-fg1" : "text-primary"}`}>
                <Switch
                    checked={props.isChecked}
                    onCheckedChange={props.onUpdate}
                />
            </div>
        </div>
    );
};


export default FieldToggle;