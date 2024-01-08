const epcColumnDefinitionsData = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community_name', width: 200},
            {headerName: 'Section', field: 'section_number'},
            {headerName: 'Lot-#', field: 'lot_number'},
            {headerName: 'Contract Date', field: 'contract_date'},
            {headerName: 'Product', field: 'product'},
            {headerName: 'Elevation', field: 'elevation', width: 120},
        ],
    },
    {
        headerName: 'Drafting',
        children: [
            {headerName: 'Drafter', field: 'drafter_name'},
            {headerName: 'Assigned', field: 'drafting_assigned_on_date'},
            {headerName: 'Finished', field: 'drafting_finished_date'},
        ],
    },
    {
        headerName: 'Engineering',
        children: [
            {headerName: 'Engineer', field: 'engineer_name'},
            {headerName: 'Sent', field: 'engineering_sent'},
            {headerName: 'Received', field: 'engineering_received'},
        ],
    },
    {
        headerName: 'Plat',
        children: [
            {headerName: 'Plat Eng.', field: 'plat_name'},
            {headerName: 'Sent', field: 'plat_sent'},
            {headerName: 'Received', field: 'plat_received'},
        ],
    },
    {
        headerName: 'Permitting',
        children: [
            {headerName: 'County', field: 'county'},
            {headerName: 'Submitted', field: 'permit_submitted'},
            {headerName: 'Received', field: 'permit_received'},
        ],
    },
    {
        headerName: 'Build By Plans',
        children: [
            {headerName: 'Posted', field: 'bbp_posted'},
        ],
    },
    {
        headerName: 'Notes', field: 'notes'
    },
];

export default epcColumnDefinitionsData;
