// import { Outlet } from "react-router-dom"
import MainLayout from "@/templates/MainLayout"
import Engineer_1 from "./Engineer1"
import Engineer_2 from "./Engineer2"
import County_1 from "./County1"
import County_2 from "./County2"
import "./dashboard.css"
import Ticker from "./Ticker"

function DashboardHome() {
    return (
        <MainLayout>

            <Ticker />

            <div className="pl-10 pr-10 pb-10 pt-0">
                <div className="bg-default-bg1 rounded-lg p-4 m-0">
                    <p className="text-2xl font-bold p-2 text-center">Dashboard</p>
                    <div className="rounded-lg flex flex-wrap justify-center">
                        <Engineer_1 />
                        <Engineer_2 />
                    </div>
                    <p className="text-center text-2xl">Engineering</p>
                </div>

                <div className="bg-default-bg1 rounded-lg p-4 m-4">
                    <div className="rounded-lg flex flex-wrap justify-center">
                        <County_1 />
                        <County_2 />
                    </div>
                    <p className="text-center text-2xl">County</p>
                </div>
            </div>

        </MainLayout>
    )
}

export default DashboardHome
