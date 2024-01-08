const columnDefinitions = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community_name', width: 200},
            {headerName: 'Section', field: 'section'},
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
            {headerName: 'Dead Line', field: 'drafting_dead_line'},
            {headerName: 'Finished', field: 'drafting_finished_date'},
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
    {
        headerName: 'Plat',
        children: [
            {headerName: 'Plat Eng.', field: 'plat_name'},
            {headerName: 'Sent', field: 'plat_sent'},
            {headerName: 'Expected', field: 'plat_expected'},
            {headerName: 'Received', field: 'plat_received'},
        ],
    },
    {
        headerName: 'Permitting',
        children: [
            {headerName: 'County', field: 'county'},
            {headerName: 'Expected-Submit', field: 'permit_expected_submit'},
            {headerName: 'Submitted', field: 'permit_submitted'},
            {headerName: 'Received', field: 'permit_received'},
        ],
    },
    {
        headerName: 'Build By Plans',
        children: [
            {headerName: 'Expected-Post', field: 'bbp_expected'},
            {headerName: 'Posted', field: 'bbp_posted'},
        ],
    },
    {
        headerName: 'Notes', field: 'notes'
    },
];

const sampleRowData = {
        community_name: 'The Bluffton',
        section: '0',
        lot_number: '20',
        contract_date: '2023-01-04',
        product: 'Davidson',
        elevation: 'A - Colonial',
        drafter_name: "Shiva",
        drafting_dead_line: "2023-11-02",
        drafting_finished_date: "2023-10-01",
        engineer_name: "HBS",
        engineering_sent: "2023-09-23",
        engineering_expected: "2023-10-23",
        engineering_received: "None",
        plat_name: "HBS",
        plat_sent: "2023-09-23",
        plat_expected: "2023-10-23",
        plat_received: "None",
        county: "Goochland",
        permit_expected_submit: "2023-10-26",
        permit_submitted: "2023-10-22",
        permit_received: "None",
        bbp_expected: "2023-11-10",
        bbp_posted: "2023-11-23",
        notes: "this is a note1"
    };


const rowData = Array.from({ length: 50}, () => ({ ...sampleRowData}));


export {columnDefinitions, rowData}
