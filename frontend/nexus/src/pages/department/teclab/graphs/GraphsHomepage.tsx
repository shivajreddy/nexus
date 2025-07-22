import MainLayout from "@/templates/MainLayout"
import Graph1 from "./Graph1"
import { DemoGraph } from "./DemoGraph"

function GraphsHomePage() {
    return (
        <MainLayout>
            <Graph1 />
            <DemoGraph />
        </MainLayout>
    )
}

export default GraphsHomePage 
