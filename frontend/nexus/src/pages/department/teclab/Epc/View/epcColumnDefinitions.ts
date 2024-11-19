import {ColGroupDef} from "ag-grid-community";
import colorCode from "@pages/department/teclab/Epc/helpers/colorCode.ts";
// import {colorCode, colorCode2} from "@pages/department/teclab/Epc/helpers/colorCode.ts";

const epcColumnDefinitions: ColGroupDef[] = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community_name', width: 200},
            {headerName: 'Section', field: 'section_number'},
            {headerName: 'Lot-#', field: 'lot_number'},
            {headerName: 'Contract Type', field: 'contract_type', width: 170},
            {headerName: 'Contract Date', field: 'contract_date', width: 170},
            {headerName: 'Product', field: 'product'},
            {headerName: 'Elevation', field: 'elevation', width: 120},
        ],
        marryChildren: true
    },
    {
      headerName: 'Home Site',
      children: [
            {headerName: 'Completed On', field: 'homesiting_completed_on', width: 170},
      ],
    },
    {
        headerName: 'Drafting',
        children: [
            {headerName: 'Drafter', field: 'drafter_name'},
            {headerName: 'Assigned', field: 'drafting_assigned_on_date'},
            // {headerName: 'Finished', field: 'drafting_finished_date', cellClassRules: colorCode},
            {headerName: 'Finished', field: 'drafting_finished_date', cellStyle: colorCode},
            // {headerName: 'Finished', field: 'drafting_finished_date', cellStyle: (params)=> colorCode(params, 10)},
        ],
        marryChildren: true
    },
    {
        headerName: 'Engineering',
        children: [
            {headerName: 'Engineer', field: 'engineer_name'},
            {headerName: 'Sent', field: 'engineering_sent'},
            // {headerName: 'Received', field: 'engineering_received'},
            {headerName: 'Received', field: 'engineering_received', cellStyle: colorCode},
            // {headerName: 'Received', field: 'engineering_received', cellStyle: (params)=>colorCode(params, 20)},
        ],
        marryChildren: true
    },
    {
        headerName: 'Plat',
        children: [
            {headerName: 'Plat Eng.', field: 'plat_name'},
            {headerName: 'Sent', field: 'plat_sent'},
            // {headerName: 'Received', field: 'plat_received'},
            {headerName: 'Received', field: 'plat_received', cellStyle: colorCode},
        ],
        marryChildren: true
    },
    {
        headerName: 'Permitting',
        children: [
            {headerName: 'County', field: 'county', width: 140},
            {headerName: 'Submitted', field: 'permit_submitted'},
            // {headerName: 'Received', field: 'permit_received'},
            {headerName: 'Received', field: 'permit_received', cellStyle: colorCode},
        ],
        marryChildren: true
    },
    {
        headerName: 'Build By Plans',
        children: [
            // {headerName: 'Posted', field: 'bbp_posted', width: 150},
            {headerName: 'Posted', field: 'bbp_posted', width: 150, cellStyle: colorCode},
        ],
        marryChildren: true
    },

    {
        headerName: 'Notes',
        children: [
            {field: 'notes', headerName: '', width: 300}
        ],
        marryChildren: true
    },
];

export default epcColumnDefinitions;
