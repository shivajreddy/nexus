import MainLayout from "@/templates/MainLayout";

import { AgGridReact } from "ag-grid-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-material.css";
import "ag-grid-community/styles/ag-theme-balham.css";

import "@assets/pages/Epc/Epc.css";
import "@assets/pages/Epc/nexus-ag-grid.css";
// import '@assets/pages/Epc/Epc.scss';

import { rowData, columnDefinitions, gridOptions } from "./demodata";

import EpcMenu from "./EpcMenu";

function Epc() {
  return (
    <MainLayout>
      <div className="epc-container">
        <div className="epc-header">
          <h1 className="font-bold lg:text-2xl"> Eagle Projects Console </h1>
          <EpcMenu />
        </div>

        <div
          id="epc-grid-home"
          // className="ag-theme-nexus"
          // className="ag-theme-material"
          // className="ag-theme-alpine"
          className="ag-theme-balham ag-theme-nexus"
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
