import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {HiPencilAlt} from "react-icons/hi";
import {Button} from "@components/ui/button.tsx";
import {MdDelete} from "react-icons/md";

import {
    Command,
    CommandEmpty,
    CommandInput,
    CommandItem,
    CommandList,
} from "@components/ui/command.tsx"


const EditFormData = () => {

    const axios = useAxiosPrivate();

    const [allFormData, setAllFormData] = useState({
        "all_communities": [],
        "all_products": [],
        "all_elevations": [],
        "all_drafters": [],
        "all_engineers": [],
        "all_plat_engineers": [],
        "all_counties": []
    })

    // + Fetch the data
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            const productsResponse = await axios.get('/eagle/core-models');
            const elevationsResponse = await axios.get('/department/teclab/elevations');
            const draftersResponse = await axios.get('/department/teclab/drafters');
            const engineersResponse = await axios.get('/eagle/engineers');
            const platEngineersResponse = await axios.get('/eagle/plat-engineers');
            const countiesResponse = await axios.get('/eagle/counties');
            setAllFormData({
                all_communities: communitiesResponse.data,
                all_products: productsResponse.data,
                all_elevations: elevationsResponse.data,
                all_drafters: draftersResponse.data,
                all_engineers: engineersResponse.data,
                all_plat_engineers: platEngineersResponse.data,
                all_counties: countiesResponse.data
            })
        }

        getData().then(() => {
        });
    }, [])


    const handleEdit = (id: string) => {
        // Implement your edit logic here
        console.log(`Editing item with ID: ${id}`);
    };

    const handleDelete = async (id: string) => {
        // Implement your delete logic here
        try {
            await axios.delete(`/eagle/communities/${id}`);
            // Update the state after a successful deletion
            setAllFormData((prevData) => prevData.filter((item) => item !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const Item = ({name}) => (
        <CommandItem>
            <Button variant="outline" onClick={() => handleEdit(name)}>
                <HiPencilAlt/>
            </Button>
            <span>{name}</span>
            <Button variant="outline" onClick={() => handleDelete(name)}>
                <MdDelete/>
            </Button>
        </CommandItem>
    );

    return (
        <div>
            <Command className="rounded-lg border shadow-md h-140">
                <CommandInput placeholder="Search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {allFormData.map((eachItem: any) => {
                            return (
                                <Item name={eachItem} key={eachItem}/>
                            )
                        }
                    )}
                </CommandList>
            </Command>
        </div>);

};


export default EditFormData;
