/*
:: MainLayout.tsx
+ This is the main layout, for all authenticated users
*/

import Navbar from "@/templates/Navbar"
// import SideBar from "@templates/SideBar"
import {ReactNode} from "react";
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";


interface IProps {
    children: ReactNode;
}

function MainLayout({children}: IProps) {

    return (
        <BaseThemeContainer>
            <Navbar/>
            <div className="m-4">
            {children}
            </div>
        </BaseThemeContainer>
    )
}

export default MainLayout