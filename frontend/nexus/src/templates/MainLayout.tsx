/*
:: MainLayout.tsx
+ This is the main layout, for all authenticated users
*/

import Navbar from "@/templates/Navbar"
import SideBar from "@templates/SideBar"
import MainLayoutBody from "@templates/MainLayoutBody"
import {ReactNode} from "react";
import "@assets/templates/mainlayout.css"
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";


interface IProps {
    children: ReactNode;
}

function MainLayout({children}: IProps) {

    return (
        <BaseThemeContainer>

            <div className="main-layout">

                <Navbar/>

                <div className="main-layout-container">
                    <SideBar/>
                    <MainLayoutBody>
                        {children}
                    </MainLayoutBody>
                </div>

            </div>
        </BaseThemeContainer>
    )
}

export default MainLayout