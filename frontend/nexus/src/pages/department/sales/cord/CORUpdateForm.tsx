import {useState} from "react";
import ProjectFinderWithResults from "@pages/Project/ProjectFinderWithResults.tsx";


const CORUpdateForm = () => {

    const [searchStatus, setSearchStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);
    const [chosenProject, setChosenProject] = useState<ResultProject | undefined>(undefined);

    function getTheprojectData() {
        console.log("hiiiii");
        console.log(selectedProject);
    }

    return (
        <div className="border border-b0 m-4 rounded-xl bg-default-bg2">
            <div className="flex items-center justify-center bg-default-bg2 p-2 rounded-t-md border-b">
                <p className="font-medium text-2xl text-center">C.O.R. Dashboard (CORD)</p>
            </div>

            <ProjectFinderWithResults
                searchStatus={searchStatus}
                setSearchStatus={setSearchStatus}
                searchResults={searchResults}
                setSearchResults={setSearchResults}

                setChosenProject={setChosenProject}

                // handleChooseProject={handleChosenProject}
                // selectedProject={selectedProject}
                // setSelectedProject={setSelectedProject}
                // handleProjectSelection={getTheprojectData}
            />

        </div>
    );
};

export default CORUpdateForm;
