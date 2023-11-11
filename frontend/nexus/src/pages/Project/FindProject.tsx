import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {Button} from "@/components/ui/button";
import {Loader2} from "lucide-react";


interface Iprops {
    status: "loading" | "success" | "failed";
    setStatus: React.Dispatch<React.SetStateAction<"loading" | "success" | "failed">>;
}


const FindProject = ({...props}: Iprops) => {

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

    const handleSubmit = () => {
        props.setStatus('loading');
    }

    return (
        <div className="px-10 p-5 bg-default-bg2 rounded-lg">
            <p className="px-4 font-semibold text-2xl">Find Project</p>
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
                        <p>Status: {props.status}</p>
                        {props.status === 'success' &&
                          <Button variant="primary" onClick={handleSubmit}>
                            Submit
                          </Button>
                        }
                        {props.status === 'loading' &&
                          <Button disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                            Loading</Button>
                        }
                    </div>
                </div>
                <div className="m-2 p-4">
                    <p>results</p>
                </div>
            </div>
        </div>
    );
};


export default FindProject;
