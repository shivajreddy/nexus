import {Input} from '@/components/ui/input'
import {Label} from "@components/ui/label.tsx";
import React from "react";
import {cn} from "@/lib/utils.ts";

interface IProps {
    id: string;
    name: string;
    placeholder?: string;
    value?: string;
    onUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string | undefined;
    disabled?: boolean;
}

const FieldText = (props: IProps) => {

    return (
        <div className={cn("flex items-center py-2", props.className)}>
            {/*<div className="flex-1 flex flex-grow items-center">*/}
            <div className="basis-1/3 flex items-center">
                <Label className="text-lg font-medium cursor-pointer"
                       htmlFor={props.id}
                >
                    {props.name}
                </Label>
                <div className="flex-grow border-t ml-4"></div>
            </div>
            {/*<div className="flex-1 cursor-pointer">*/}
            <div className="basis-2/3 cursor-pointer">
                <Input
                    id={props.id}
                    type="string"
                    className={`font-semibold  ${props.disabled ? "pointer-events-none text-default-fg1" : "text-primary"}`}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={(e) => props.onUpdate(e)}
                />
            </div>
        </div>
    );
};


export default FieldText;