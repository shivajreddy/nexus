import React, {useState} from "react";
import {v4 as uuid} from 'uuid';
import {Input} from "@components/ui/input.tsx";


function NewListItem({ createItem }: any) {

    // const [userInput, setUserInput] = useState({task: ""});
    const [userInput, setUserInput] = useState("");


    const handleChange = (evt: any) => {
        // console.log("evt=", evt);
        // console.log("evt.target=", evt.target);
        // setUserInput({ [evt.target.name]: evt.target.value });
        setUserInput(evt.target.value);
    };

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const newItem = { id: uuid(), data: userInput};
        createItem(newItem);
        // setUserInput({ task: "" });
        setUserInput("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="task">New Item</label>
            <Input
                value={userInput}
                onChange={handleChange}
                id="task"
                type="text"
                name="task"
                // placeholder="New Item"
            />
            <button>New Item</button>
        </form>
    );
}

export default NewListItem;
