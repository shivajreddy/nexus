import MainLayout from "@/templates/MainLayout"
import "./dashboard.css"
import Ticker from "./Ticker"
import CarouselOrientation from "./Test"

function DashboardHome() {
    return (
        <MainLayout>

            <Ticker />

            <CarouselOrientation />

            {/* <div className="p-5"> */}
            {/*     <div className="bg-default-bg1 rounded-lg p-4 m-4"> */}
            {/*         <div className="rounded-lg flex flex-wrap justify-center"> */}
            {/*             <County_1 /> */}
            {/*             <County_2 /> */}
            {/*         </div> */}
            {/*         <p className="text-center text-2xl">County</p> */}
            {/*     </div> */}
            {/* </div> */}

        </MainLayout>
    )
}

export default DashboardHome
