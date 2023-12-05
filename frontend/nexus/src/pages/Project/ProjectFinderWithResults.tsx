import ProjectFinder from "@pages/Project/ProjectFinder.tsx";
import {ScrollArea} from "@components/ui/scroll-area.tsx";
import React, {useState} from "react";


interface Iprops {
    searchStatus: "initial" | "loading" | "failed";
    setSearchStatus: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed">>;

    searchResults: ResultProject[];
    setSearchResults: React.Dispatch<React.SetStateAction<ResultProject[]>>;

    setChosenProject: React.Dispatch<React.SetStateAction<ResultProject | undefined>>;

    // selectedProject: boolean[];
    // setSelectedProject: React.Dispatch<React.SetStateAction<boolean[]>>
    // handleProjectSelection: any;
}


const ProjectFinderWithResults = (props: Iprops) => {
    const [selectedProject, setSelectedProject] = useState(Array(props.searchResults.length).fill(false));

    function handleChosenProject(idx: number, targetProject: ResultProject) {
        console.log("idx=", idx);
        console.log("targetProject", targetProject);
        // highlight the selected project
        setSelectedProject(() => {
            const newState = Array(props.searchResults.length).fill(false);
            newState[idx] = true;
            return newState;
        })

        props.setChosenProject(targetProject);
    }

    return (
        <div>
            <p className="pb-3 font-semibold text-2xl text-center">Project Finder</p>
            <div className="flex justify-center items-start">
                <div>
                    <ProjectFinder
                        searchStatus={props.searchStatus}
                        setSearchStatus={props.setSearchStatus}
                        searchResults={props.searchResults}
                        setSearchResults={props.setSearchResults}
                    />
                </div>

                {props.searchResults.length > 0 &&
                  <div className="grow rounded-md rounded-l-none bg-default-bg2 h-96">
                    <ScrollArea className="rounded-md p-2 px-4 h-72 border">
                      <div className="w-full">
                          {props.searchResults.map((item, idx) =>
                              <button key={idx}
                                      className={`p-1 px-2 m-2 rounded-md font-medium border-none border-2 ${selectedProject[idx] ? "bg-primary-bg0 text-white" : "bg-default-bg0"}`}
                                      onClick={() => handleChosenProject(idx, item)}
                              >
                                  {item.project_id}
                              </button>
                          )}
                      </div>
                    </ScrollArea>
                  </div>
                }
            </div>

        </div>
    );
};

export default ProjectFinderWithResults;
