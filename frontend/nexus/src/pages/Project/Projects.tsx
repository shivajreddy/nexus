import MainLayout from "@templates/MainLayout.tsx";
import FindProject from "@pages/Project/FindProject.tsx";
import {useState} from "react";
import CreateProject from "@pages/Project/CreateProject.tsx";
import {LoadingProgress} from "@components/common/LoadingProgress.tsx";

const Projects = () => {

    const [getProjectsStatus, setGetProjectsStatus] = useState<"initial" | "loading" | "failed">("initial");

    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);

    return (
        <MainLayout>
            <div id="projects-container"
                // className="h-[calc(100vh-100px)] bg-default-bg1 rounded-2xl border"
                 className="bg-default-bg1 rounded-md border"
            >
                <p className="font-semibold text-3xl p-2 pt-6 text-center">PROJECTS</p>

                <div className="m-4">
                    <FindProject
                        status={getProjectsStatus}
                        setStatus={setGetProjectsStatus}
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
                                <p key={idx}
                                   className="p-1 px-2 mx-2 rounded-md  font-medium bg-default-bg0"
                                >
                                    {item.project_id}
                                </p>
                            )}
                        </div>
                      </div>
                    }
                    {statusEPCDataFetch === 'loading' &&
                      <div className="mx-4"><LoadingProgress/></div>
                    }
                    <CreateProject/>
                </div>

            </div>
        </MainLayout>
    );
};

export default Projects;
