import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@components/ui/select.tsx";
import {Label} from "@components/ui/label.tsx";
import {INewLotData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import React from "react";


interface IProps {
    id: string;
    name: string;
    data: string[];
    // specific to lot form
    pieceOfStateName: keyof INewLotData;
    setNewLotData: React.Dispatch<React.SetStateAction<INewLotData>>;
}


const FieldDropDown = (props: IProps) => {

    function handleChange(e: string) {
        console.log("e = ", e);
        props.setNewLotData((prevLotData: INewLotData) => {
            return {
                ...prevLotData,
                [props.pieceOfStateName]: e
            }
        })
    }

    return (
        <div key={props.id} className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer" htmlFor={props.id}>{props.name}</Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1">
                <Select onValueChange={handleChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose a value"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup className="max-h-40 overflow-y-scroll">
                            {props.data.map(val => <SelectItem key={val} value={val}>{val}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default FieldDropDown;
