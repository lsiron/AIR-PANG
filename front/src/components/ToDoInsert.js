import "./ToDoInsert.css";
import {MdAdd} from 'react-icons/md'
import { useCallback, useState } from "react";

function ToDoInsert({onInsert}) {
    
    const [value, setValue] = useState('');
    const onChange = useCallback(e=>{
        setValue(e.target.value);
    },[])
    const onSubmit = useCallback(
        e => {
            onInsert(value);
            setValue('');
            e.preventDefault();
        }
    ,[onInsert, value])
    return (
        <form className="TodoInsert" onSubmit={onSubmit}>
            <input 
            onChange={onChange}
            value={value} placeholder="할 일 만들기" />
            <button type="submit">
                <MdAdd />
            </button>
        </form>
    )
}

export default ToDoInsert;