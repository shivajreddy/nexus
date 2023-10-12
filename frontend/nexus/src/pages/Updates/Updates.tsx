import MainLayout from "@/templates/MainLayout"
import NexusThemes from "./NexusThemes"
import {MyCard} from "@pages/Updates/MyCard.tsx";
import {Button} from "@components/ui/button.tsx";

function Updates() {
    return (
        <MainLayout>
            <div className="updates-page-container m-4">

                <NexusThemes/>
                <MyCard/>

                <p> Going to test for a button</p>

                <Button variant="link">
                    HI
                </Button>
                <Button variant="default">
                    HI
                </Button>

            </div>
        </MainLayout>
    )
}


export default Updates