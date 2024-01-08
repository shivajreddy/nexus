import {useState} from "react";
import ListItem from "./ListItem.tsx";
import NewListItem from "../View/NewListItem.tsx";
import {v4 as uuid} from 'uuid';
import {Command, CommandEmpty, CommandInput, CommandList} from "@components/ui/command.tsx";


interface IItem {
    id: string;
    data: string;
}


function ListItems() {
    const [items, setItems] = useState([
        {id: uuid(), data: "task 1"},
        {id: uuid(), data: "task 2"}
    ]);

    const create = (newItem: IItem) => {
        console.log(newItem);
        setItems([...items, newItem]);
    };

    const remove = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const update = (id: string, updateItem: string) => {
        const updatedItems = items.map(item => {
            if (item.id === id) {
                return {...item, task: updateItem};
            }
            return item;
        });
        setItems(updatedItems);
    };

    const allItems = items.map(item => (
            <ListItem key={item.id} item={item} remove={remove} update={update}/>
    ));

    return (
        <div>
            <p className="text-xl">ITEM LIST OF: {}</p>
            <Command className="rounded-lg border shadow-md h-140">
                <CommandInput placeholder="Search..."/>
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {allItems}
                </CommandList>
            </Command>
            <NewListItem createItem={create}/>
        </div>
    );
}

export default ListItems;