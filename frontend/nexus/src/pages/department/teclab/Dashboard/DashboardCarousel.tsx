import {
    Carousel,
    CarouselContent,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import EngineeringPreviousMonth from "./EngineeringPreviousMonth"
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useState, useEffect } from "react";
import EngineeringCurrentYear from "./EngineeringCurrentYear"
import EngineeringCurrentMonth from "./EngineeringCurrentMonth";
import { ColorProvider } from "./ColorContext";
import PermittingCurrentYear from "./PermittingCurrentYear";
import PermittingPreviousMonth from "./PermittingPreviousMonth";
import PermittingCurrentMonth from "./PermittingCurrentMonth";
import DraftingCurrentYear from "./DraftingCurrentYear";
import DraftingPreviousMonth from "./DraftingPreviousMonth";
import DraftingCurrentMonth from "./DraftingCurrentMonth";


function DashboardCarousel() {
    const axios = useAxiosPrivate();
    const [responseData, setResponseData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<Error | null>(null);
    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const response = await axios.get("/department/teclab/dashboard/engineer-dashboard-data");
                console.log("parent component response:::::", response.data);
                setResponseData(response.data);
            } catch (err) {
                console.error("Failed to fetch data:", err);
                if (err instanceof Error) {
                    setError(err);
                } else {
                    setError(new Error("Unknown error occurred"));
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading dashboard data...</div>;
    }

    if (error) {
        return <div className="text-red-500">Error loading dashboard data. Please try again later.</div>;
    }
    return (
        <div className="bg-default-bg1 rounded-sm py-14 m-4" >

            <ColorProvider>

                <Carousel
                    opts={{
                        align: "center",

                        loop: true,
                        duration: 20,

                        watchDrag: false

                    }}
                    orientation="vertical"
                    className="w-full"
                >
                    <CarouselContent className="h-[600px]">

                        {responseData !== null &&
                            <>
                                < div className="bg-default-bg1 rounded-lg p-0 m-0">
                                    <p className="text-xl p-2 text-center font-bold">DRAFTING</p>
                                    <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2 pb-6">
                                        <DraftingPreviousMonth responseData={responseData[0]} />
                                        <DraftingCurrentMonth responseData={responseData[0]} />
                                        <DraftingCurrentYear responseData={responseData[0]} />
                                    </div>
                                </div>
                                <div className="bg-default-bg1 rounded-lg p-0 m-0">
                                    <p className="text-xl p-2 text-center font-bold">ENGINEERING</p>
                                    <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2 pb-6">
                                        <EngineeringPreviousMonth responseData={responseData[1]} />
                                        <EngineeringCurrentMonth responseData={responseData[1]} />
                                        <EngineeringCurrentYear responseData={responseData[1]} />
                                    </div>

                                </div>
                                <div className="bg-default-bg1 rounded-lg p-4 m-0">
                                    <p className="text-xl p-2 text-center font-bold">PLAT</p>
                                    <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2 pb-6">
                                        <EngineeringPreviousMonth responseData={responseData[2]} />
                                        <EngineeringCurrentMonth responseData={responseData[2]} />
                                        <EngineeringCurrentYear responseData={responseData[2]} />
                                    </div>
                                </div>
                                <div className="bg-default-bg1 rounded-lg p-4 m-0">
                                    <p className="text-xl p-2 text-center font-bold">PERMITTING</p>
                                    <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2 pb-6">
                                        <PermittingPreviousMonth responseData={responseData[3]} />
                                        <PermittingCurrentMonth responseData={responseData[3]} />
                                        <PermittingCurrentYear responseData={responseData[3]} />
                                    </div>
                                </div>
                            </>
                        }

                    </CarouselContent>

                    <CarouselPrevious className="bg-white text-gray-500" />
                    <CarouselNext className="bg-white text-gray-500" />
                </Carousel>

            </ColorProvider>

        </div >
    )
}
export default DashboardCarousel

/*
    return (
        <div className="bg-default-bg1 rounded-sm py-14 m-4">
            <Carousel
                opts={{
                    align: "center",
                    loop: true,
                    duration: 20,
                    watchDrag: false
                }}
                orientation="vertical"
                className="w-full"
            >

                <CarouselContent className="h-[520px]">
                    <div className="bg-default-bg1 rounded-lg p-0 m-0">
                        <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2">
                            <EngineeringPreviousMonth responseData={responseData} />
                        </div>
                    </div>
                </CarouselContent>
            </Carousel>
        </div>
    );

}


export default DashboardCarousel
*/
