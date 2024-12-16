import MainLayout from "@templates/MainLayout.tsx";
import ProjectFinder from "@pages/Project/ProjectFinder.tsx";
import React, {useState} from "react";
import CreateProject from "@pages/Project/CreateProject.tsx";

interface Iprops {
    searchStatus: "initial" | "loading" | "failed";

    setSearchStatus: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed">>;
    searchResults: ResultProject[];

    setSearchResults: React.Dispatch<React.SetStateAction<ResultProject[]>>;

    setChosenProject: React.Dispatch<React.SetStateAction<ResultProject | undefined>>;
}

const Projects = (props: Iprops) => {

    const [getProjectsStatus, setGetProjectsStatus] = useState<"initial" | "loading" | "failed">("initial");

    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);

    const [selectedProject, setSelectedProject] = useState(Array(searchResults.length).fill(false));

    function handleChosenProject(idx: number, targetProject: ResultProject) {
        // console.log("idx=", idx);
        // console.log("targetProject", targetProject);
        // highlight the selected project
        setSelectedProject(() => {
            const newState = Array(searchResults.length).fill(false);
            newState[idx] = true;
            return newState;
        })

        props.setChosenProject(targetProject);
    }
    return (
        <MainLayout>
            <div id="projects-container"
                // className="h-[calc(100vh-100px)] bg-default-bg1 rounded-2xl border"
                 className="bg-default-bg1 rounded-md border"
            >
                <p className="font-semibold text-3xl p-2 pt-6 text-center">PROJECTS</p>

                <div className="m-4">
                    <ProjectFinder
                        searchStatus={getProjectsStatus}
                        setSearchStatus={setGetProjectsStatus}
                        // statusEPCDataFetch={statusEPCDataFetch}
                        // setStatusEPCDataFetch={setStatusEPCDataFetch}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}

                    />
                    {searchResults.length > 0 &&
                        <div className="mt-0 m-4 p-4 rounded-md bg-default-bg2">
                            <p className="font-medium text-lg px-4">Results</p>
                            <div className="whitespace-nowrap flex w-full pb-4 px-4 overflow-x-scroll">
                                {searchResults.map((item, idx) =>
                                    <button key={idx}
                                        className={`p-1 px-2 m-2 rounded-md font-medium border-none border-2 ${selectedProject[idx] ? "bg-primary-bg0 text-white" : "bg-default-bg0"}`}
                                        onClick={() => handleChosenProject(idx, item)}
                                    >
                                        {item.project_id}
                                    </button>
                                )}
                            </div>
                        </div>
                    }
                    <CreateProject/>
                </div>

            </div>
        </MainLayout>
    );
};

export default Projects;