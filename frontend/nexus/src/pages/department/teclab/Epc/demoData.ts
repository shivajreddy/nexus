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

const rowData = [
    {
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
        notes: "this is a note1"
    },
    {
        drafting: '0',
        engineering: '4',
        plat: '2022-12-08',
        permit: 'C.Zobel',
        bbp: '2022-12-12',
        notes: 'DFI',
        community: '2022-12-26',
        section: 'AES',
        'lot#': '2022-12-26',
        'contract-date': 'James City',
        'assigned-to': '2022-12-29',
        'draft-deadline': 'None',
        'eng-planned-receipt': 'On Hold',
    },
    {
        drafting: '5',
        engineering: '02',
        plat: '2023-02-23',
        permit: 'C.Zobel',
        bbp: '2023-02-27',
        notes: 'HBS',
        community: '2023-03-13',
        section: 'Koontz',
        'lot#': '2023-03-13',
        'contract-date': 'Henrico',
        'assigned-to': '2023-03-16',
        'draft-deadline': 'None',
        'eng-planned-receipt': 'On Hold',
    },
    {
        drafting: '5',
        engineering: '28',
        plat: '2023-04-04',
        permit: 'C.Zobel',
        bbp: '2023-04-06',
        notes: 'Struc Tech',
        community: '2023-04-20',
        section: 'EDA',
        'lot#': '2023-04-20',
        'contract-date': 'Goochland',
        'assigned-to': '2023-04-25',
        'draft-deadline': 'None',
        'eng-planned-receipt': 'permit & hold lot- lot change from 9-5',
    },
];


export {columnDefinitions, rowData}
