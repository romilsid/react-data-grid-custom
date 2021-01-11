import React, { useState } from 'react';
import "react-data-grid/dist/react-data-grid.css";

const CustomTextEditor = (props) => {
    // const [text, setText] = useState(props?.row?.currency);

    const onChangeHandler = (event) => {
        // setText(event.target.value);
        props.onChange(props.row.id, event.target.value);
    }
    

    return (
        <span>
            <input 
                type="numer"
                className="rdg-text-editor"
                value={props.row.currency}
                onChange = {onChangeHandler}
            />

        </span>
    );
}

export default CustomTextEditor;