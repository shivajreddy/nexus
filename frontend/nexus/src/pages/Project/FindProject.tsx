import {Card, CardContent, CardFooter, CardHeader} from "@components/ui/card.tsx";
import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";

const FindProject = () => {

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

    return (
        <Card>
            <CardHeader>
                <p>Find Project</p>
            </CardHeader>
            <CardContent>
                <FieldDropDown id="1_community"
                               name={"Community"}
                               dropdownData={existingCommunities}
                               value={community}
                               onUpdate={(newValue) => setCommunity(newValue)}
                />
                <FieldText id="1_section"
                           name={"Section"}
                           value={section}
                           onUpdate={(e) => setSection(e.target.value)}
                />
                <FieldText id="1_lot_number"
                           name={"Lot Number"}
                           value={lotNumber}
                           onUpdate={(e) => setLotNumber(e.target.value)}
                />
                <p>Searching for, Project Code:</p>
                <div className="flex">
                    <p>{community} - </p>
                    <p>{section} - </p>
                    <p>{lotNumber}</p>
                </div>
            </CardContent>
            <CardFooter>
            </CardFooter>

        </Card>
    );
};

export default FindProject;
