import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {Button} from "@/components/ui/button";


interface Iprops {
    status: "initial" | "loading" |"failed";
    setStatus: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed">>;
}


const FindProject = ({...props}: Iprops) => {

    const axios = useAxiosPrivate();
    const [existingCommunities, setExistingCommunities] = useState<string[]>([]);

    const [community, setCommunity] = useState<string>("");
    const [section, setSection] = useState<string>("");
    const [lotNumber, setLotNumber] = useState<string>("");

    const [results, setResults] = useState<string[]>([]);

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
        props.setStatus('loading');
        try {
            const response = await axios.post("/projects",
                {
                    "community": community,
                    "section": section,
                    "lot_number": lotNumber
                },
                {headers: {"Content-Type": "application/json"}}
            )
            console.log("response for /projects: ", response);
            setResults(response.data);
            props.setStatus('initial');
        } catch (e) {
            props.setStatus('failed');
        }
    }

    return (
        <div className="px-10 p-5 bg-default-bg2 rounded-lg my-4">
            <p className="px-4 font-semibold text-2xl">Find Project's</p>
            <div className="flex border-2 rounded-lg">
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
                <div className="m-2 p-4">
                    <div className="flex select-none">
                        <p className="font-medium">Project Code:</p>
                        <div className="flex px-2">
                            <p className="h-max px-2 border rounded-lg">{community ? community : "ALL"}</p>
                            <p className="h-max mx-2 px-2 border rounded-lg">{section ? section : "ALL"}</p>
                            <p className="h-max px-2 border rounded-lg">{lotNumber ? lotNumber : "ALL"}</p>
                        </div>
                    </div>
                    <div className="my-4">
                        {props.status === 'initial' &&
                          <Button variant="primary" onClick={handleSubmit}>
                            Fetch
                          </Button>
                        }
                        {props.status === 'loading' &&
                          <button disabled
                                  className="cursor-not-allowed flex items-center p-2 rounded-md bg-default-fg1 text-default-bg2">
                            Please wait
                          </button>
                        }
                        {props.status === 'failed' &&
                          <Button variant="primary" onClick={handleSubmit}>
                            Failed to fetch
                          </Button>
                        }
                    </div>
                </div>
            </div>
            {results.length > 0 &&
              <div className="m-2 p-4">
                <p>Results. Total: {results.length}</p>
                  {results.map((item, idx) => <p key={idx}>{JSON.stringify(item)}</p>)}
              </div>
            }
        </div>
    );
};


export default FindProject;
