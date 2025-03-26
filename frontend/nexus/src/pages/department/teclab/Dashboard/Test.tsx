import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Engineer_1 from "./Engineer1"
import Engineer_2 from "./Engineer2"

function CarouselOrientation() {

    return (
        <div className="bg-default-bg1 rounded-sm p-4 py-14 m-2" >

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
                    <div className="bg-default-bg1 rounded-lg p-4 m-0">
                        <p className="text-xl p-2 text-center">DRAFTING</p>
                        <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2">
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                        </div>
                    </div>
                    <div className="bg-default-bg1 rounded-lg p-4 m-0">
                        <p className="text-xl p-2 text-center">ENGINEERING</p>
                        <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2">
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                        </div>
                    </div>
                    <div className="bg-default-bg1 rounded-lg p-4 m-0">
                        <p className="text-xl p-2 text-center">PLAT</p>
                        <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2">
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                        </div>
                    </div>
                    <div className="bg-default-bg1 rounded-lg p-4 m-0">
                        <p className="text-xl p-2 text-center">PERMITTING</p>
                        <div className="rounded-lg flex flex-row overflow-x-auto flex-nowrap pl-2">
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                            <Engineer_1 />
                            <Engineer_2 />
                        </div>
                    </div>
                </CarouselContent>

                <CarouselPrevious className="bg-white text-gray-500" />
                <CarouselNext className="bg-white text-gray-500" />
            </Carousel>

        </div >
    )
}
export default CarouselOrientation
