import React, { useReducer, useState } from "react";
import DataGrid from "react-data-grid";
import DropDown from "./CustomDropDown/CustomDropDown";
// import createRowData from "./createRowData";
import config from './config.json';
import {ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } from 'react-contextmenu';
import {createPortal } from 'react-dom';
import './react-contextmenu.css';
import "react-data-grid/dist/react-data-grid.css";
import {Row as GridRow} from 'react-data-grid';
import './App.css';

const col = config.columns;
const meta = config.columnMetadata;

function rowKeyGetter(row) {
  return row.id;
}

const currencyFormatter = new Intl.NumberFormat(navigator.language, {
  style: "currency",
  currency: "usd"
});

function CurrencyFormatter({ value }) {
  return (
    <div className='cell-padding'>
      {currencyFormatter.format(value)}
    </div>
  );
}

function autoFocus(input) {
  input?.focus();
}

const TextEditor = (props) => {
  console.log(props);
  return (
    <span>
      <input ref = {autoFocus} type = "text" className="rdg-text-editor" value={props.row[props.column.key]} onChange={(event) => props.onTextChange(event, props)} />
    </span>
  );
}

const ContextTextEditor = (props) => {
  return (
    <span className="buttonInside">
      <input type="text"  value="Percent" className="input-ContextMenu" />
      <button id="open"><i className="fa fa-pencil"></i></button>
    </span>
  );
}

const App = () => {
  const customRows = [
    {
      id : 1,
      comments: "Testing",
      membershipType: "Premium",
      vehicleType: "SUV",
      minSalePrice: 50,
      maxSalePrice: 200,
      pricingFunction: "",
      pricingValue: ""
    },
    {
      id : 2,
      comments: "Testing",
      membershipType: "Basic",
      vehicleType: "Sedan",
      minSalePrice: 500,
      maxSalePrice: 2000,
      pricingFunction: "",
      pricingValue: ""
    },
    {
      id : 3,
      comments: "Testing done",
      membershipType: "Medium",
      vehicleType: "Coupe",
      minSalePrice: 500,
      maxSalePrice: 2000,
      pricingFunction: "",
      pricingValue: ""
    }
  ];

  const [rows, setRows] = useState(customRows);
  // const [nextId, setNextId] = useReducer(id => id + 1, rows[rows.length - 1].id + 1);

  const colus = col.map(c => {
    const key = c.key;
    const temp = Object.entries(meta).filter(entry => {
      return entry[0] === key;
    });
    const obj = temp[0][1];
    let add = {};
    switch(obj.type) {

      case "Text":
        add = {
          editor: (props) => (
            <TextEditor {...props}  onTextChange = {handleTextEditor} />
          ),
          formatter: (props) => {
            let flag = false;
            console.log(props);
            console.log(rows[props.rowIdx][props.column.key]);
            if(props.rowIdx >= 1 ){
              if( rows[props.rowIdx][props.column.key] !== rows[props.rowIdx - 1][props.column.key] ) {
              flag = true;
              }
            } else {
              flag = true;
            }
            return (
              <>
                {flag ? (
                  <div className="break-cell">
                    {props.row[props.column.key]}  
                  </div>
                ) : (
                  <div className="continuous-cell">
                  {props.row[props.column.key]}
                  </div>
                )}
              </>
            );
          }
        }
      break;

      case "DropDown":
        add = {
          formatter : (props) => (
          <DropDown {...props} optionsNeeded = {obj.options} onChange={handleDropDownChange}  />
          ) 
        };
        break;

      case "Currency":
        add = {
          editor: (props) => (
            <TextEditor {...props} onTextChange = {handleTextEditor} />
          ),
          formatter: (props) => {
            return (
            <CurrencyFormatter {...props} value={props.row[key]} />
          )}
        };
        break;

      case "ContextMenu": 
        add ={
          formatter: (props) => (
            <ContextTextEditor {...props} />
          )
        };
        break;

      default:
        add = {};
        break;

    }
    
    const final = {
      ...c,
      ...add
    };

    return final;
  });


  const handleDropDownChange = (props, value) => {

      const oldRows = [...rows];
      oldRows.forEach((row) => {
          if(row.id === props.row.id) {
            row[props.column.key] = value;
          }
      });
      
      setRows(oldRows);
  };

  const handleTextEditor = (event, props) => {
    console.log("props + ", props);
    const oldRows = [...rows];
    oldRows.forEach((row) => {
        if(row.id === props.row.id) {
          row[props.column.key]= event.target.value;
        }
    });

    setRows(oldRows);
  }

  const onGridRowsUpdated = ({ fromRow, toRow, updated }) => {

    setRows((rows) => {
      const updatedRows = rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        updatedRows[i] = { ...updatedRows[i], ...updated };
      }
      return { updatedRows };
    });

  };

  function onRowDelete( event, obj) {
    let updatedRows = [
      ...rows.slice(0, obj.rowIdx),
      ...rows.slice(obj.rowIdx + 1)
    ];
    setRows(updatedRows);
    
  }

  function onRowInsertAbove( event, obj) {
    insertRow(obj.rowIdx);
  }

  function onRowInsertBelow( event, obj) {
    insertRow(obj.rowIdx + 1);
  }

  function insertRow(rowIdx) {
    const newRow = [ ...rows.slice(rowIdx -1, rowIdx)];
    let updatedRows = [
      ...rows.slice(0, rowIdx),
      ...newRow,
      ...rows.slice(rowIdx)
    ];
    setRows(updatedRows);
    // setNextId();  
  }

  function RowRenderer(props) {
    return (
      <ContextMenuTrigger id="grid-context-menu" collect={() => ({rowIdx: props.rowIdx})} >
        <GridRow {...props} />
      </ContextMenuTrigger>
    );
  }

  return (
    <>
      <DataGrid
        rowKeyGetter={rowKeyGetter}
        columns={colus}
        rows={rows}
        rowRenderer={RowRenderer}
        className="fill-grid"
        onRowsChange={onGridRowsUpdated}
      />

      {createPortal(
        <ContextMenu id="grid-context-menu">
          <MenuItem onClick={onRowDelete}>Delete Row</MenuItem>
          <SubMenu title="Insert Row">
            <MenuItem onClick={onRowInsertAbove}>Above</MenuItem>
            <MenuItem onClick={onRowInsertBelow}>Below</MenuItem>
          </SubMenu>
        </ContextMenu>,
        document.body
      )}
    </>

  );
};

export default App;









  // const columns = [
  //   { key: "id", name: "ID" },
  //   { key: "lastName", name: "Last Name", 
  //     editor: (props) => (
  //       <TextEditor {...props} onTextChange = {handleTextEditor} />
  //     )
  //   },
  //   {
  //     key: "currency",
  //     name: "Currency",
  //     editor: (props) => (
  //       <TextEditor {...props} onTextChange = {handleTextEditor} />
  //     ),
  //     formatter: (props) => (
  //       <CurrencyFormatter {...props} value={props.row.currency} />
  //     )
  //   },
  //   { key: "jobTitle", name: "Job Title" },
  //   {
  //     key: "jobType",
  //     name: "Job Type",
  //     editable: true,
  //     resizable: true,
  //     formatter: (props) => (
  //       <DropDown {...props} op onChange={handleDropDownChange}  />
  //     )
  //   },
  //   { key: "phone", name: "Phone" }
  // ];
