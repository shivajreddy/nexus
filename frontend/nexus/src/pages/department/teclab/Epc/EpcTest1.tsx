
import {AgGridReact} from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "./EpcTest1.css"

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-alpine.css";
// import "ag-grid-community/styles/ag-theme-material.css";
// import "ag-grid-community/styles/ag-theme-balham.css";

import {useEffect, useRef, useState} from "react";


function EpcTest1() {

    const gridRef = useRef();
    const [rowData, setRowData] = useState();
    const [columnDefs, setColumnDefs] = useState([
        // {field: 'athlete'},
        // {field: 'age'},
        // {field: 'country'},
        // {field: 'year'},
        // {field: 'date'},
        // {field: 'sport'},
        // {field: 'gold'},
        {
            headerName: 'Drafting',
            children: [
                {headerName: 'Drafter', field: 'drafter_name'},
                {headerName: 'Dead Line', field: 'drafting_dead_line'},
                {headerName: 'Finished', field: 'drafting_finished_date'},
                // {headerName: 'Time', field: 'time'},
            ],
        },
        {
            headerName: 'Engineering',
            children: [
                {headerName: 'Engineer', field: 'engineer_name'},
                {headerName: 'Sent', field: 'engineering_sent'},
                {headerName: 'Expected', field: 'engineering_expected'},
                {headerName: 'Received', field: 'engineering_received'},
            ],
        },
    ]);

    useEffect(() => {
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(result => result.json())
            .then(rowData => setRowData(rowData))
    }, [])

    const gridOptions = {
        // rowStyle: {background: 'red'},
        // all even rows assigned 'my-shaded-effect'
        getRowClass: params => {
            console.log("prams=", params.data.age)
            if (params.data.age > 20) {
                return 'bg-red-500';
            }
        },
        rowClassRules: {
            'rag-green': 'data.age < 20',
            'rag-amber': 'data.age >= 20 && data.age < 25',
            // 'rag-red': 'data.age >= 25',
        },
    }

    return (
        <div className="ag-theme-alpine" style={{height: '100%'}}>
            <AgGridReact
                rowData={rowData} animateRows={true}
                columnDefs={columnDefs}
                gridOptions={gridOptions}
            />
        </div>
    )
}


export default EpcTest1;
