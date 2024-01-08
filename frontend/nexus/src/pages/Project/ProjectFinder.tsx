import FieldDropDown from "@pages/department/teclab/Epc/helpers/FieldDropDown.tsx";
import FieldText from "@/pages/department/teclab/Epc/helpers/FieldText";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {Button} from "@/components/ui/button";
import {FaSearch} from "react-icons/fa";


interface Iprops {
    searchStatus: "initial" | "loading" | "failed";
    setSearchStatus: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed">>;

    // statusEPCDataFetch: "initial" | "loading" | "failed" | "success";
    // setStatusEPCDataFetch: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed" | "success">>;

    searchResults: ResultProject[];
    setSearchResults: React.Dispatch<React.SetStateAction<ResultProject[]>>;
}


const ProjectFinder = ({...props}: Iprops) => {

    const axios = useAxiosPrivate();
    const [existingCommunities, setExistingCommunities] = useState<string[]>([]);

    const [community, setCommunity] = useState<string>("");
    const [section, setSection] = useState<string>("");
    const [lotNumber, setLotNumber] = useState<string>("");


    // + Fetch data from server
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            setExistingCommunities(communitiesResponse.data);
        }

        getData().then(() => {
        });
    }, [])

    const handleSubmit = async () => {
        props.setSearchStatus('loading');
        try {
            const response = await axios.post("/projects/search",
                {
                    "community": community,
                    "section": section,
                    "lot_number": lotNumber
                },
                {headers: {"Content-Type": "application/json"}}
            )
            // console.log("response for /projects: ", response);
            props.setSearchResults(response.data);
            props.setSearchStatus('initial');
        } catch (e) {
            props.setSearchStatus('failed');
        }
    }

    return (
        // <div className="m-8 mt-4 mb-0 mr-0 p-4 min-w-[30em] bg-default-bg2 rounded-md rounded-r-none">
        //     <p className="pb-3 font-semibold text-2xl">Project Finder</p>
        (<div className="min-w-[30em]">
            <div className="flex flex-col">
                <div className="m-2">
                    <FieldDropDown id="1_community"
                                   className="mx-4"
                                   name={"Community"}
                                   dropdownData={existingCommunities}
                                   value={community}
                                   onUpdate={(newValue) => setCommunity(newValue)}
                    />
                    <FieldText id="1_section"
                               className="mx-4"
                               name={"Section"}
                               value={section}
                               onUpdate={(e) => setSection(e.target.value)}
                    />
                    <FieldText id="1_lot_number"
                               className="mx-4"
                               name={"Lot Number"}
                               value={lotNumber}
                               onUpdate={(e) => setLotNumber(e.target.value)}
                    />
                </div>
                <div className="mx-2 px-4">
                    <div className="flex select-none justify-center">
                        {/*<p className="font-medium">Project Code:</p>*/}
                        <div className="flex">
                            <p className="h-max px-2 border rounded-lg">{community ? community : "ALL"}</p>
                            <p className="h-max mx-2 px-2 border rounded-lg">{section ? section : "ALL"}</p>
                            <p className="h-max px-2 border rounded-lg">{lotNumber ? lotNumber : "ALL"}</p>
                        </div>
                    </div>
                    <div className="my-4 flex justify-center">
                        {props.searchStatus === 'initial' &&
                          <Button variant="primary" className="w-40" onClick={handleSubmit}>
                            <FaSearch/>
                            <p className="pl-2">Search</p>
                          </Button>
                        }
                        {props.searchStatus === 'loading' &&
                          <Button disabled
                                  className="w-40 cursor-not-allowed flex items-center p-2 rounded-md bg-default-fg1 text-default-bg2">
                            Please wait
                          </Button>
                        }
                        {props.searchStatus === 'failed' &&
                          <Button variant="primary" className="w-40" onClick={handleSubmit}>
                            Failed to fetch
                          </Button>
                        }
                    </div>
                </div>
            </div>
        </div>)
    );
};


export default ProjectFinder;
