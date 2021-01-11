import React, { useState } from "react";
import { Select } from "@copart/core-components";

const options = [
  { key: "Consultant", text: "Consultant" },
  { key: "Officer", text: "Officer" },
  { key: "Architect", text: "Architect" }
];

const CustomDropDown = (props) => {
  const [value, setValue] = useState(props?.row?.jobType);
  const onChangeHandler = (e, option) => {
    setValue(option.key);
    props.onChange(props, option.key);
  };
 
  return (
    <Select
      label=""
      options={props.optionsNeeded}
      onChange={onChangeHandler}
      placeholder={props.row[props.column.key]}
      selectedOption={value}
    />
  );
};

export default CustomDropDown;
