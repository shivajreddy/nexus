import MainLayout from "@templates/MainLayout.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {useEffect, useState} from "react";
import FindProject from "@pages/Project/FindProject.tsx";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import TECLabDataForm from "@pages/department/teclab/Epc/NewLot/TECLabDataForm.tsx";
import {ScrollArea} from "@components/ui/scroll-area.tsx";


function SearchAndUpdateTECLabData() {
    const navigate = useNavigate();

    const [getProjectsStatus, setGetProjectsStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);

    const [selectedProject, setSelectedProject] = useState(Array(searchResults.length).fill(false));

    const [resultProject, setResultProject] = useState<ResultProject | undefined>(undefined);

    const handleChooseProject = async (idx: number, targetProject: ResultProject) => {
        // select the project
        setSelectedProject(() => {
            const newState = Array(searchResults.length).fill(false);
            newState[idx] = true;
            return newState;
        })

        setStatusEPCDataFetch("loading");
        console.log("Handle Choose Project", targetProject);

        // + fetch project's epc data
        setResultProject(targetProject);
    }

    useEffect(() => {
        setSelectedProject(Array(searchResults.length).fill(false));
    }, [searchResults])

    return (
        <MainLayout>
            <div className="border rounded bg-default-bg1 m-4 pb-2">
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
                            <EpcMenu/>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <FindProject
                        status={getProjectsStatus}
                        setStatus={setGetProjectsStatus}
                        // statusEPCDataFetch={statusEPCDataFetch}
                        // setStatusEPCDataFetch={setStatusEPCDataFetch}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}
                    />
                    {searchResults.length > 0 &&
                      <div className="grow mt-4 mr-4 p-4 rounded-md rounded-l-none bg-default-bg2 h-96">
                        <p className="pb-3 font-semibold text-2xl">Results</p>
                        <ScrollArea className="rounded-md p-2 px-4 h-72 border">
                            {/*<div className="whitespace-nowrap flex flex-wrap w-full pb-4 px-4">*/}
                          <div className="flex flex-wrap w-full pb-4 px-4">
                              {searchResults.map((item, idx) =>
                                  <button key={idx}
                                          className={`p-1 px-2 m-2 rounded-md  font-medium ${selectedProject[idx] ? "border-primary border-2 bg-primary-bg0 text-white" : "bg-default-bg0"}`}
                                          onClick={() => handleChooseProject(idx, item)}
                                  >
                                      {item.project_id}
                                  </button>
                              )}
                          </div>
                        </ScrollArea>
                      </div>
                    }
                </div>

                {/*{statusEPCDataFetch === 'success' && resultProject &&*/}
                {resultProject &&
                  <TECLabDataForm className="ml-4 pt-2"
                                  statusEPCDataFetch={statusEPCDataFetch}
                                  setStatusEPCDataFetch={setStatusEPCDataFetch}
                                  project_id={resultProject.project_id}
                                  project_uid={resultProject.project_uid}
                  />
                }

            </div>
        </MainLayout>
    );
}


export default SearchAndUpdateTECLabData;
