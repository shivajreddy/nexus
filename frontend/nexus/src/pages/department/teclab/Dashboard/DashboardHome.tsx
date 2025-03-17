// import { Outlet } from "react-router-dom"
import MainLayout from "@/templates/MainLayout"
import Chart1 from "./Chart1"


function DashboardHome() {
  return (
    <MainLayout>
      <div className="pl-10 pr-10 pb-10 pt-0">
        <p className="text-2xl font-bold py-4 text-center">Dashboard</p>

        <Chart1 />
        <Chart1 />

      </div>
    </MainLayout>
  )
}

export default DashboardHome
