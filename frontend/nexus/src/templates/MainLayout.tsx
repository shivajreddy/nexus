/*
:: MainLayout.tsx
+ This is the main layout, for all authenticated users
*/

import Navbar from "@/templates/Navbar"
// import SideBar from "@templates/SideBar"
import {ReactNode} from "react";
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";
import {cn} from "@/lib/utils.ts";


interface IProps {
    children: ReactNode;
    className?: string | undefined;
}

function MainLayout(props: IProps) {

    return (
        <div className={cn(props.className)}>
            <BaseThemeContainer>
                <Navbar/>
                {props.children}
            </BaseThemeContainer>
        </div>
    )
}

export default MainLayout