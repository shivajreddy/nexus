import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@components/ui/tooltip.tsx";
import {FaInfoCircle} from "react-icons/fa";
import {ReactNode} from "react";

interface IProps {
    children: ReactNode;
}

const MyComponent = (props: IProps) => {
    return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <p className="px-2"><FaInfoCircle/></p>
                    </TooltipTrigger>
                    <TooltipContent>
                        {props.children}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
    );
};

export default MyComponent;
