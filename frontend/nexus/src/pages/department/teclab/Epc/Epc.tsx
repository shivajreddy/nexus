import MainLayout from "@/templates/MainLayout";

import {AgGridReact} from "ag-grid-react";

import EpcMenu from "./EpcMenu";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "@/assets/pages/Epc/Epc.css"


import {rowData, columnDefinitions} from "./demoData.ts";


const defaultColumnSettings = {
    sortable: true,
    filter: true,
    resizable: false,
    width: 120,
    searchable: true,
    // wrapText: true,
    // wrapText: false
    wrapHeaderText: true,
    autoHeaderHeight: true,
    floatingFilter: true,
}

const gridOptions = {
    defaultColDef: defaultColumnSettings,
    columnDefs: columnDefinitions,

    // Group columns
    groupHeaderHeight: 40,

    // Label columns
    headerHeight: 30,
    // headerWidth: 30,
    // Floating filter
    floatingFiltersHeight: 50,

    // Pivoting, requires turning on pivot mode. Label columns
    pivotHeaderHeight: 100,

    // Pivoting, requires turning on pivot mode. Group columns
    pivotGroupHeaderHeight: 50,

    // sideBar: true,
    // suppressMenuHide: true
}


function Epc() {
    return (
        <MainLayout>
            <div className="epc-container">
                <div className="epc-header">
                    <h1 className="font-bold lg:text-2xl"> Eagle Projects Console </h1>
                    <EpcMenu/>
                </div>

                <div
                    id="nexus-epc-grid-container"
                    className="ag-theme-alpine ag-theme-nexus"
                >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefinitions}
                        gridOptions={gridOptions}
                    ></AgGridReact>
                </div>

            </div>
        </MainLayout>
    );
}

export default Epc;
