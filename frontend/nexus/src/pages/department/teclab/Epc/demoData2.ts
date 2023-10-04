const columnDefinitions = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community'},
            {headerName: 'Section', field: 'section'},
            {headerName: 'Lot-#', field: 'lot_number'},
            {headerName: 'Contract Date', field: 'contract_date'},
            {headerName: 'Core-Model', field: 'core_model'},
            {headerName: 'Elevation', field: 'elevation'},
        ],
    },
    {
        headerName: 'Drafting',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
    {
        headerName: 'Engineering',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
    {
        headerName: 'Plat',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
    {
        headerName: 'Permitting',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
    {
        headerName: 'Build By Plans',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
    {
        headerName: 'Notes',
        children: [
            {headerName: 'Drafting', field: 'drafting'},
            {headerName: 'Engineering', field: 'engineering'},
            {headerName: 'Plat', field: 'plat'},
            {headerName: 'Permit', field: 'permit'},
            {headerName: 'BBP', field: 'bbp'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },

    {
        headerName: '✎',
        children: [
            {headerName: 'Community', field: 'community'},
            {headerName: 'Section', field: 'section'},
            {headerName: 'Lot#', field: 'lot#'},
            {headerName: 'Contract-Date', field: 'contract-date'},
            {headerName: 'Assigned To', field: 'assigned-to'},
            {headerName: 'Draft Deadline', field: 'draft-deadline'},
            {headerName: 'Engineering', field: 'eng-planned-receipt'},
            {headerName: 'Plat Engineering', field: 'plat-engineering'},
            {headerName: 'Plat Planned Receipt', field: 'plat-planned-receipt'},
            {headerName: 'Permit Jurisdiction', field: 'permit-jurisdiction'},
            {headerName: 'Permit Planned Submit', field: 'permit-planned-submit'},
            {headerName: 'BBP Planned Posted', field: 'bbp-planned-posted'},
            {headerName: 'Notes', field: 'notes'},
        ],
    },
];

const rowData = [
    {
        drafting: '0',
        engineering: '20',
        plat: 'None',
        permit: 'K.Fadl',
        bbp: '2023-01-04',
        notes: 'HBS',
        community: '2023-01-18',
        section: 'EDA',
        'lot#': '2023-01-23',
        'contract-date': 'Goochland',
        'assigned-to': 'None',
        'draft-deadline': 'None',
        'eng-planned-receipt': 'hold',
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

const columnSettings = {
    sortable: true,
    filter: true,
    resizable: true
}

const gridOptions = {
    columnDefs: columnDefinitions,
    defaultColDef: columnSettings
}


export {columnDefinitions, rowData, gridOptions}
