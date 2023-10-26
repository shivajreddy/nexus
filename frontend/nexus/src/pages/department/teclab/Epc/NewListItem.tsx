import React, {useState} from "react";
import {v4 as uuid} from 'uuid';


function NewListItem({ createTodo }: any) {
    // const [userInput, setUserInput] = useReducer(
    //     (state, newState) => ({ ...state, ...newState }),
    //     {
    //         task: ""
    //     }
    // );

    const [userInput, setUserInput] = useState({task: ""});

    const handleChange = (evt: any) => {
        console.log("evt=", evt);
        // setUserInput({ [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const newTodo = { id: uuid(), task: userInput.task, completed: false };
        createTodo(newTodo);
        setUserInput({ task: "" });
    };

    return (
        <form className="NewTodoForm" onSubmit={handleSubmit}>
            <label htmlFor="task">New todo</label>
            <input
                value={userInput.task}
                onChange={handleChange}
                id="task"
                type="text"
                name="task"
                placeholder="New Todo"
            />
            <button>Add Todo</button>
        </form>
    );
}

export default NewListItem;
