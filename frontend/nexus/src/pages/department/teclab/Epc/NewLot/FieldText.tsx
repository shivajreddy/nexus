import {Input} from '@/components/ui/input'
import {Label} from "@components/ui/label.tsx";
import React from "react";

interface IProps {
    id: string;
    name: string;
    placeholder?: string;
    value?: string;
    onUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FieldText = (props: IProps) => {

    return (
        <div className="flex items-center py-2">
            <div className="flex-1 flex flex-grow items-center">
                <Label className="text-lg font-medium cursor-pointer"
                       htmlFor={props.id}
                >
                    {props.name}
                </Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            <div className="flex-1 cursor-pointer">
                <Input
                    id={props.id}
                    type="string"
                    className="text-primary"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(e) => props.onUpdate(e)}
                />
            </div>
        </div>
    );
};


export default FieldText;