import MainLayout from "@templates/MainLayout.tsx";
import FindProject from "@pages/Project/FindProject.tsx";
import {useState} from "react";

const Projects = () => {

    const [searchStatus, setSearchStatus] = useState<"loading" | "success" | "failed">("success");

    return (
        <MainLayout>
            <div id="projects-container"
                 className="h-[calc(100vh-100px)]
                 bg-default-bg1 rounded-2xl border"
            >
                <div className="bg-default-bg2 rounded-t-2xl">
                    <p className="font-semibold text-2xl p-4 text-center"> Projects </p>
                </div>

                <div className="m-4 p-4">
                    <FindProject status={searchStatus} setStatus={setSearchStatus}/>
                </div>

            </div>
        </MainLayout>
    );
};

export default Projects;
