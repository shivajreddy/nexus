import { useState } from "react";
import ListItem from "./ListItem.tsx";
import NewListItem from "./NewListItem.tsx";
import {v4 as uuid} from 'uuid';


interface IItem{
    id: string;
    data: string;
}


function ListItems() {
    const [items, setItems] = useState([
        { id: uuid(), data: "task 1" },
        { id: uuid(), data: "task 2" }
    ]);

    const create = (newTodo: IItem) => {
        console.log(newTodo);
        setItems([...items, newTodo]);
    };

    const remove = (id: string) => {
        setItems(items.filter(todo => todo.id !== id));
    };

    const update = (id: string, updateItem: string) => {
        const updatedTodos = items.map(todo => {
            if (todo.id === id) {
                return { ...todo, task: updateItem };
            }
            return todo;
        });
        setItems(updatedTodos);
    };

    const todosList = items.map(todo => (
        <ListItem
            key={todo.id}
            item={todo}
            update={update}
            remove={remove}
        />
    ));

    return (
        <div>
            <p className="text-xl">ITEM LIST OF: {}</p>
            <div>{todosList}</div>
            <NewListItem createTodo={create} />
        </div>
    );
}

export default ListItems;