import MainLayout from "@/templates/MainLayout"
import Graph1 from "./Graph1"
import { DemoVolumeGraph } from "./DemoVolumeGraph"

function GraphsHomePage() {
    return (
        <MainLayout>
            <Graph1 />
            <DemoVolumeGraph />
        </MainLayout>
    )
}

export default GraphsHomePage 
