import MainLayout from "@/templates/MainLayout";

import {AgGridReact} from "ag-grid-react";

import EpcMenu from "./EpcMenu";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "@/assets/pages/Epc/Epc.css"


import {rowData, columnDefinitions} from "./demoData.ts";
import {BsPlusCircleFill} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {MdClearAll, MdOutlineStorage} from "react-icons/md";
import {CgMenuGridO} from "react-icons/cg";


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
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="epc-container">

                <div className="epc-header border">
                    <div className="border-r-2">
                        <h1 className="font-bold lg:text-2xl"> Eagle Projects Console </h1>
                    </div>

                    <div className="flex mx-10">
                        {/* TODO: this should be role specific*/}
                        <div className="flex justify-center items-center">
                            <button className="flex justify-center items-center" onClick={() => navigate('lot/new')}>
                                <p className="pr-2"><BsPlusCircleFill/></p>
                                Add New Lot
                            </button>
                        </div>
                        <div className="flex justify-center items-center ml-8">
                            <button className="flex justify-center items-center"
                                    onClick={() => navigate('/epc/all-lots')}>
                                <p className="pr-2"><CgMenuGridO/></p>
                                All Lots
                            </button>
                        </div>

                        <EpcMenu/>

                    </div>
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
