import React, {useState} from "react";
import {HiPencilAlt} from "react-icons/hi";
import {MdDelete} from "react-icons/md";
import {CommandItem} from "@components/ui/command.tsx";
import {Button} from "@components/ui/button.tsx";


interface IListItem {
    item: any;
    remove: any;
    update: any;
}

function ListItem({item, remove, update}: IListItem) {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(item.data);
    console.log("logging: ", value)

    const toggleFrom = () => {
        setIsEditing(!isEditing);
    };
    const handleUpdate = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        update(item.id, value);
        toggleFrom();
    };
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setValue(evt.target.value);
    };

    let result;
    if (isEditing) {
        result = (
            <form onSubmit={handleUpdate}>
                <input onChange={handleChange} value={value} type="text"/>
                <button>Save</button>
            </form>
        );
    } else {
        result = (
            <CommandItem className="flex items-center rounded-lg border border-b0 m-2 p-4 max-w-lg">
                <Button variant="outline" onClick={toggleFrom}>
                    <HiPencilAlt/>
                </Button>
                <span>{value}</span>
                <Button variant="outline" onClick={() => remove(item.id)}>
                    <MdDelete/>
                </Button>
            </CommandItem>
        );
    }
    return result;
}

export default ListItem;


/*
<span className="text-xl">{value}</span>
<div >
    <button onClick={toggleFrom}>
        <HiPencilAlt/>
    </button>
    <button onClick={()=>{remove(item.id)}}>
        <MdDelete/>
    </button>
</div>
*/
