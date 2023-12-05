import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@components/ui/tooltip.tsx";
import {FaInfoCircle} from "react-icons/fa";
import {ReactNode} from "react";

interface IProps {
    text?: string;
    children?: ReactNode;
}

const MyComponent = (props: IProps) => {
    return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="px-2"><FaInfoCircle/></p>
                    </TooltipTrigger>
                    <TooltipContent>
                        {props.text && <p>{props.text}</p>}
                        {props.children}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
    );
};

export default MyComponent;
