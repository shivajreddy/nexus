import {ColGroupDef} from "ag-grid-community";


const foscColumnDefinitions: ColGroupDef[] = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community_name', width: 200},
            {headerName: 'Section', field: 'section_number'},
            {headerName: 'Lot-#', field: 'lot_number'},
            // not needed to show
            // {headerName: 'Lot Started', field: 'lot_status_started'},
            // {headerName: 'Lot Finished', field: 'lot_status_finished'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Supervisors',
        children: [
            {headerName: 'Project Manager', field: 'assigned_pm', width: 160},
            {headerName: 'Director', field: 'assigned_director', width: 150},
        ],
        marryChildren: true
    },
    {
        headerName: 'Foundation',
        children: [
            {headerName: 'Scanned', field: 'foundation_scan_status'},
            {headerName: 'Date', field: 'foundation_scan_date'},
            {headerName: 'Reported', field: 'foundation_report_status'},
            {headerName: 'Reporter', field: 'foundation_reporter'},
            {headerName: 'Date', field: 'foundation_report_date'},
            {headerName: 'Uploaded', field: 'foundation_uploaded'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Slab',
        children: [
            {headerName: 'Scanned', field: 'slab_scan_status'},
            {headerName: 'Date', field: 'slab_scan_date'},
            {headerName: 'Reported', field: 'slab_report_status'},
            {headerName: 'Reporter', field: 'slab_reporter'},
            {headerName: 'Date', field: 'slab_report_date'},
            {headerName: 'Uploaded', field: 'slab_uploaded'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Frame',
        children: [
            {headerName: 'Scanned', field: 'frame_scan_status'},
            {headerName: 'Date', field: 'frame_scan_date'},
            {headerName: 'Reported', field: 'frame_report_status'},
            {headerName: 'Reporter', field: 'frame_reporter'},
            {headerName: 'Date', field: 'frame_report_date'},
            {headerName: 'Uploaded', field: 'frame_uploaded'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Mep',
        children: [
            {headerName: 'Scanned', field: 'mep_scan_status'},
            {headerName: 'Date', field: 'mep_scan_date'},
            {headerName: 'Reported', field: 'mep_report_status'},
            {headerName: 'Reporter', field: 'mep_reporter'},
            {headerName: 'Date', field: 'mep_report_date'},
            {headerName: 'Uploaded', field: 'mep_uploaded'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Warranty/Misc',
        children: [
            {headerName: 'Scanned', field: 'misc_scan_status'},
            {headerName: 'Reported', field: 'misc_report_status'},
        ],
        marryChildren: true
    },
    {
        headerName: 'Notes',
        children: [
            {field: 'notes', headerName: 'notes', width: 300}
        ],
        marryChildren: true
    },
];

export default foscColumnDefinitions;
