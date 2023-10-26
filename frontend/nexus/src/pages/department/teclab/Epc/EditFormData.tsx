import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {HiPencilAlt} from "react-icons/hi";
import {Button} from "@components/ui/button.tsx";
import {MdDelete} from "react-icons/md";



const EditFormData = () => {
    const [data, setData] = useState([]);

    const axios = useAxiosPrivate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('/eagle/communities');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, [axios]);

    const handleEdit = (id: string) => {
        // Implement your edit logic here
        console.log(`Editing item with ID: ${id}`);
    };

    const handleDelete = async (id: string) => {
        // Implement your delete logic here
        try {
            await axios.delete(`/eagle/communities/${id}`);
            // Update the state after a successful deletion
            setData((prevData) => prevData.filter((item) => item !== id));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const Item = ({name}) => (
        <div key={name} className="flex items-center w-80 m-4">
            <p className="text-xl px-2">{name}</p>
            <Button variant="outline" onClick={() => handleEdit(name)}>
                <HiPencilAlt />
            </Button>
            <Button variant="outline" onClick={() => handleDelete(name)}>
                <MdDelete />
            </Button>
        </div>
    );

    return <div>{data.map((eachItem) => <Item name={eachItem} key={eachItem}/>)}</div>;
};


export default EditFormData;
