import {Switch} from "@components/ui/switch.tsx";
import {Label} from "@components/ui/label.tsx";
import {Input} from "@components/ui/input.tsx";

interface IProps {
    id: string;
    name: string;
    isChecked: boolean;
    updateLotData: any;
}

const FieldToggle = (props: IProps) => {

    function setNewFieldState() {
        props.updateLotData(prevData => ({
            ...prevData,
            lot_status_finished: !prevData.lot_status_finished
        }))
    }

    return (
        <div className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1 flex items-center">
                <Switch
                    checked={props.isChecked}
                    onCheckedChange={setNewFieldState}
                />
            </div>
        </div>
    );
};


export default FieldToggle;