import { ColGroupDef } from "ag-grid-community";

const ihmsPipelineColumnDefinitions: ColGroupDef[] = [
    {
        headerName: 'House Master',
        children: [
            { headerName: 'House No.', field: 'unpackedhousenum', width: 150 },
            { headerName: 'Housenumber', field: 'housenumber', width: 150 },
            { headerName: 'Section', field: 'developmentcode', width: 150 },
            { headerName: 'Model', field: 'model', width: 120 },
            { headerName: 'Elevation', field: 'elev', width: 120 },
            { headerName: 'Const Start', field: 'conststart_date', width: 150 },
            { headerName: 'Block No.', field: 'blocknumber', width: 120 },
            { headerName: 'Lot No.', field: 'lotnumber', width: 120 },
            { headerName: 'ARB Submit', field: 'arb_submit', width: 150 },
            { headerName: 'ARB Approved', field: 'arb_approved', width: 150 },
            { headerName: 'Permit Applied', field: 'permit_applied', width: 150 },
            { headerName: 'Permit Date', field: 'permit_date', width: 150 },
            { headerName: 'BBP Posted', field: 'bbp_posted', width: 150 },
            { headerName: 'PO Released', field: 'po_released', width: 150 },
            { headerName: 'Buyer Name', field: 'buyername', width: 200 },
            { headerName: 'Ratified Date', field: 'ratified_date', width: 150 },
            { headerName: 'Misc 2 Date', field: 'misc2_date', width: 150 },
            { headerName: 'LS Late Change', field: 'lslatechangedate', width: 150 },
            { headerName: 'Estimated Settlement', field: 'estsettl_date', width: 150 },
        ],
        marryChildren: true
    },
    {
        headerName: 'UD House Master',
        children: [
            { headerName: 'Company Code', field: 'companycode', width: 120 },
            { headerName: 'Drafted By', field: 'draftedby', width: 150 },
            { headerName: 'Plat Ordered', field: 'platordereddate', width: 150 },
            { headerName: 'Plat Received', field: 'platrecdate', width: 150 },
            { headerName: 'Structural Co', field: 'structuralco', width: 150 },
            { headerName: 'Eng Ordered', field: 'engordereddate', width: 150 },
            { headerName: 'Eng Received', field: 'engrecvddate', width: 150 },
            { headerName: 'PM Rev Job', field: 'pmrevjobdate', width: 150 },
            { headerName: 'Home Site Rpt', field: 'homesiterprtdate', width: 150 },
            { headerName: 'Notes', field: 'notes', width: 200 },
        ],
        marryChildren: true
    },
    {
        headerName: 'Schedule House Detail',
        children: [
            { headerName: 'Step Number', field: 'stepnumber', width: 120 },
            { headerName: 'Activity Code', field: 'activitycode', width: 120 },
            { headerName: 'Foundation Start', field: 'foundation_start', width: 150 },
            { headerName: 'Foundation Finish', field: 'foundation_finish', width: 150 },
            { headerName: 'Early Start', field: 'earlystartdate', width: 150 },
            { headerName: 'Early Finish', field: 'earlyfinishdate', width: 150 },
            { headerName: 'Late Start', field: 'latestartdate', width: 150 },
            { headerName: 'Late Finish', field: 'latefinishdate', width: 150 },
        ],
        marryChildren: true
    },
    {
        headerName: 'UD Prospect MST',
        children: [
            { headerName: 'Loan Status', field: 'loanstatuscom', width: 150 },
            { headerName: 'Selection Due', field: 'selectionduedate', width: 150 },
            { headerName: 'Life Style Opt Due', field: 'lifstloptduedate', width: 150 },
            { headerName: 'LS Complete Date', field: 'lscompletedate', width: 150 },
        ],
        marryChildren: true
    },
];

export default ihmsPipelineColumnDefinitions;
