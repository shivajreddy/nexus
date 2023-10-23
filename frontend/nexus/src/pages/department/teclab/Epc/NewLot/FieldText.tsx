import {Input} from '@/components/ui/input'
import {Label} from "@components/ui/label.tsx";
import {INewLotData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import React from "react";

interface IProps {
    id: string;
    name: string;
    placeholder?: string;
    fieldText: string;
    // specific to lot form
    pieceOfStateName: keyof INewLotData;
    setNewLotData: React.Dispatch<React.SetStateAction<INewLotData>>;
}

const FieldText = (props: IProps) => {

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        props.setNewLotData((prevLotData: INewLotData) => {
            return {
                ...prevLotData,
                [props.pieceOfStateName] : e.target.value
            }
        })
    }

    return (
        <div className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1 cursor-pointer">
                <Input
                    id={props.id}
                    className=""
                    type="string"
                    placeholder={props.placeholder}
                    value={props.fieldText}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};


export default FieldText;