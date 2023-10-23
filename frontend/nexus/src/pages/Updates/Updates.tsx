import MainLayout from "@/templates/MainLayout"
import DesignScheme from "@pages/Updates/DesignScheme.tsx";

function Updates() {
    return (
        <MainLayout>
            <div className="updates-page-container m-4">
                <DesignScheme/>
            </div>
        </MainLayout>
    )
}


export default Updates