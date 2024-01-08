import MainLayout from "@templates/MainLayout.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {useState} from "react";
// import ProjectFinder from "@pages/Project/ProjectFinder.tsx";
import TECLabDataForm from "@pages/department/teclab/Epc/View/TECLabDataForm.tsx";
// import {ScrollArea} from "@components/ui/scroll-area.tsx";
import ProjectFinderWithResults from "@pages/Project/ProjectFinderWithResults.tsx";


function SearchAndUpdateTECLabData() {
    const navigate = useNavigate();

    const [getProjectsStatus, setGetProjectsStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);

    // const [_, setSelectedProject] = useState(Array(searchResults.length).fill(false));

    const [chosenProject, setChosenProject] = useState<ResultProject | undefined>(undefined);

    // useEffect(() => {
    //     setSelectedProject(Array(searchResults.length).fill(false));
    // }, [searchResults])

    return (
        <MainLayout>
            <div className="border rounded bg-default-bg2 m-4 pb-2">
                <div className="epc-header bg-default-bg2 rounded rounded-b-none py-2 border-b">
                    <div className="border-r flex items-center">
                        <p className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console</p>
                        <p className="ml-4 font-semibold text-primary text-xl">New Lot</p>
                    </div>

                    <div className="flex mx-10 items-center">
                        {/* TODO: this should be role specific*/}
                        <div className="flex justify-center items-center">
                            <Button variant="default" className="w-40 flex justify-center items-center"
                                    onClick={() => navigate('/epc')}>
                                <p className="pr-2"><TiArrowBack/></p>
                                Back to EPC
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="m-8">
                    <ProjectFinderWithResults
                        searchStatus={getProjectsStatus}
                        setSearchStatus={setGetProjectsStatus}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}
                        setChosenProject={setChosenProject}
                    />
                </div>

                {chosenProject &&
                  <TECLabDataForm className="ml-4 pt-2"
                                  statusEPCDataFetch={statusEPCDataFetch}
                                  setStatusEPCDataFetch={setStatusEPCDataFetch}
                                  project_id={chosenProject.project_id}
                                  project_uid={chosenProject.project_uid}
                  />
                }

            </div>
        </MainLayout>
    );
}


export default SearchAndUpdateTECLabData;
