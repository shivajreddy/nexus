import MainLayout from "@/templates/MainLayout";

import {AgGridReact} from "ag-grid-react";

import EpcMenu from "./EpcMenu";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "@/assets/pages/Epc/Epc.css"


import {rowData, columnDefinitions} from "./demoData.ts";
import {BsPlusCircleFill} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
import {CgMenuGridO} from "react-icons/cg";
import {Button} from "@components/ui/button.tsx";


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
            <div className="epc-container rounded-md">

                <div className="epc-header border border-b-0 rounded rounded-b-none py-2">
                    <div className="border-r flex items-center">
                        <h1 className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console </h1>
                        <p className="ml-4 font-semibold text-primary text-xl">Live</p>
                    </div>

                    <div className="flex mx-10">
                        {/* ? TODO: this should be role specific*/}
                        <div className="flex justify-center items-center">
                            <Button variant="outline" className="flex justify-center items-center"
                                    onClick={() => navigate('lot/new')}>
                                <p className="pr-2"><BsPlusCircleFill/></p>
                                Add New Lot
                            </Button>
                        </div>
                        <div className="flex justify-center items-center ml-8">
                            <Button variant="outline" className="flex justify-center items-center"
                                    onClick={() => navigate('/epc/all-lots')}>
                                <p className="pr-2"><CgMenuGridO/></p>
                                All Lots
                            </Button>
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
                    />

                </div>

            </div>
        </MainLayout>
    );
}

export default Epc;
