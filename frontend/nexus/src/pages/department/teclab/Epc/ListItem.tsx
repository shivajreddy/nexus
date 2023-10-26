import React, {useState} from "react";
import {HiPencilAlt} from "react-icons/hi";
import {MdDelete} from "react-icons/md";


interface IListItem {
    item: any;
    remove: any;
    update: any;
}

function ListItem({item, remove, update}: IListItem) {
    const [isEditing, setIsEditing] = useState(false);
    const [data, setData] = useState(item.data);

    const handleClick = (evt: any) => {
        remove(evt.target.id);
    };
    const toggleFrom = () => {
        setIsEditing(!isEditing);
    };
    const handleUpdate = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        update(item.id, data);
        toggleFrom();
    };
    const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setData(evt.target.value);
    };

    let result;
    if (isEditing) {
        result = (
            <div>
                <form onSubmit={handleUpdate}>
                    <input onChange={handleChange} value={data} type="text"/>
                    <button>Save</button>
                </form>
            </div>
        );
    } else {
        result = (
            <div className="flex items-center">
                <p>{data}</p>
                <div >
                    <button onClick={toggleFrom}>
                        <HiPencilAlt/>
                    </button>
                    <button onClick={handleClick}>
                        <MdDelete/>
                    </button>
                </div>
            </div>
        );
    }
    return result;
}

export default ListItem;
