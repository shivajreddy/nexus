import MainLayout from "@templates/MainLayout.tsx";

import {AgGridReact} from "ag-grid-react";

import FoscMenu from "./FoscMenu.tsx";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "@assets/pages/Epc/Epc.css"


// import {rowData, columnDefinitions} from "./demoData.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {format} from "date-fns";
import {PiPencilSimpleFill} from "react-icons/pi";
import {hasRoles} from "@/features/utils/utils.ts";
import {useUserRoles} from "@hooks/useUserRoles.ts";
import {Skeleton} from "@components/ui/skeleton.tsx";
import {TiArrowBack} from "react-icons/ti";


const defaultColumnSettings = {
    sortable: true,
    filter: true,
    resizable: false,
    width: 120,
    // searchable: true,
    // wrapText: true,
    // wrapText: false
    wrapHeaderText: true,
    autoHeaderHeight: true,
    // floatingFilter: true,
}


const columnDefinitionsData = [
    {
        headerName: 'Lot Info',
        children: [
            {headerName: 'Community', field: 'community_name', width: 200},
            {headerName: 'Section', field: 'section_number'},
            {headerName: 'Lot-#', field: 'lot_number'},
        ],
    },
    {
        headerName: 'Supervisors',
        children: [
            {headerName: 'Project Manager', field: 'assigned_pm', width: 160},
            {headerName: 'Director', field: 'assigned_director', width: 150},
        ],
    },
    {
        headerName: 'Foundation',
        children: [
            {headerName: 'Scanned', field: 'foundation_scan_status'},
            {headerName: 'Scanner', field: 'foundation_scanner'},
            {headerName: 'Date', field: 'foundation_scan_date'},
            {headerName: 'Reported', field: 'foundation_report_status'},
            {headerName: 'Reporter', field: 'foundation_reporter'},
            {headerName: 'Date', field: 'foundation_report_date'},
            {headerName: 'Uploaded', field: 'foundation_uploaded'},
        ],
    },
    {
        headerName: 'Slab',
        children: [
            {headerName: 'Scanned', field: 'slab_scan_status'},
            {headerName: 'Scanner', field: 'slab_scanner'},
            {headerName: 'Date', field: 'slab_scan_date'},
            {headerName: 'Reported', field: 'slab_report_status'},
            {headerName: 'Reporter', field: 'slab_reporter'},
            {headerName: 'Date', field: 'slab_report_date'},
            {headerName: 'Uploaded', field: 'slab_uploaded'},
        ],
    },
    {
        headerName: 'Frame',
        children: [
            {headerName: 'Scanned', field: 'frame_scan_status'},
            {headerName: 'Scanner', field: 'frame_scanner'},
            {headerName: 'Date', field: 'frame_scan_date'},
            {headerName: 'Reported', field: 'frame_report_status'},
            {headerName: 'Reporter', field: 'frame_reporter'},
            {headerName: 'Date', field: 'frame_report_date'},
            {headerName: 'Uploaded', field: 'frame_uploaded'},
        ],
    },
    {
        headerName: 'Mep',
        children: [
            {headerName: 'Scanned', field: 'mep_scan_status'},
            {headerName: 'Scanner', field: 'mep_scanner'},
            {headerName: 'Date', field: 'mep_scan_date'},
            {headerName: 'Reported', field: 'mep_report_status'},
            {headerName: 'Reporter', field: 'mep_reporter'},
            {headerName: 'Date', field: 'mep_report_date'},
            {headerName: 'Uploaded', field: 'mep_uploaded'},
        ],
    },
    {
        headerName: 'Warranty/Misc',
        children: [
            {headerName: 'Scanned', field: 'misc_scan_status'},
            {headerName: 'Reported', field: 'misc_report_status'},
            {headerName: 'Foundation Needs', field: 'foundation_needed'},
            {headerName: 'Slab Needs', field: 'slab_needed'},
            {headerName: 'Frame Needs', field: 'frame_needed'},
            {headerName: 'MEP Needs', field: 'mep_needed'},
            {headerName: 'Lot Started', field: 'lot_status_started'},
            {headerName: 'lot Finished', field: 'lot_status_finished'},
        ],
    },
    {
        headerName: 'Notes',
        children: [
            {field: 'notes', headerName: 'notes', width: 300}
        ],
    },
];


const gridOptions = {
    defaultColDef: defaultColumnSettings,
    columnDefs: columnDefinitionsData,
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


function FOSCAll() {
    const navigate = useNavigate();

    const axios = useAxiosPrivate();

    const userRoles = useUserRoles();

    // TODO: specify the type of the Lot object. which should be parallel to EPCLot from python
    const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchErrorDetails, setFetchErrorDetails] = useState('');
    const [allFOSCLots, setAllFOSCLots] = useState([]);

    const [columnDefinitions, setColumnDefinitions] = useState(columnDefinitionsData)

    // + Fetch all EPC lots
    useEffect(() => {
        const get_lots_data_from_server = async () => {
            try {
                const response = await axios.get('/department/teclab/fosc/all');
                console.log("response=", response);
                // console.log("response.data=", response.data);
                // setLotData(response.data);
                const backendData = response.data;

                // Data transformation
                const transformedData = backendData.map((item: any) => ({
                    project_uid: item.project_uid,
                    community_name: item.community,
                    section_number: item.section_number,
                    lot_number: item.lot_number,

                    assigned_pm: item.assigned_pm,
                    assigned_director: item.assigned_director,

                    foundation_scan_status: item.foundation_scan_status,
                    foundation_scanner: item.foundation_scanner,
                    foundation_scan_date: item.foundation_scan_date ? format(new Date(item.foundation_scan_date), 'MM/dd/yyyy') : null,
                    foundation_report_status: item.foundation_report_status,
                    foundation_reporter: item.foundation_reporter,
                    foundation_report_date: item.foundation_report_date ? format(new Date(item.foundation_report_date), 'MM/dd/yyyy') : null,
                    foundation_uploaded: item.foundation_uploaded,

                    slab_scan_status: item.slab_scan_status,
                    slab_scanner: item.slab_scanner,
                    slab_scan_date: item.slab_scan_date ? format(new Date(item.slab_scan_date), 'MM/dd/yyyy') : null,
                    slab_report_status: item.slab_report_status,
                    slab_reporter: item.slab_reporter,
                    slab_report_date: item.slab_report_date ? format(new Date(item.slab_report_date), 'MM/dd/yyyy') : null,
                    slab_uploaded: item.slab_uploaded,

                    frame_scan_status: item.frame_scan_status,
                    frame_scanner: item.frame_scanner,
                    frame_scan_date: item.frame_scan_date ? format(new Date(item.frame_scan_date), 'MM/dd/yyyy') : null,
                    frame_report_status: item.frame_report_status,
                    frame_reporter: item.frame_reporter,
                    frame_report_date: item.frame_report_date ? format(new Date(item.frame_report_date), 'MM/dd/yyyy') : null,
                    frame_uploaded: item.frame_uploaded,

                    mep_scan_status: item.mep_scan_status,
                    mep_scanner: item.mep_scanner,
                    mep_scan_date: item.mep_scan_date ? format(new Date(item.mep_scan_date), 'MM/dd/yyyy') : null,
                    mep_report_status: item.mep_report_status,
                    mep_reporter: item.mep_reporter,
                    mep_report_date: item.mep_report_date ? format(new Date(item.mep_report_date), 'MM/dd/yyyy') : null,
                    mep_uploaded: item.mep_uploaded,

                    warranty_scan_status: item.warranty_scan_status,
                    warranty_report_status: item.warranty_report_status,
                    foundation_needed: item.foundation_needed,
                    slab_needed: item.slab_needed,
                    frame_needed: item.frame_needed,
                    mep_needed: item.mep_needed,
                    lot_status_started: item.lot_status_started,
                    lot_status_finished: item.lot_status_finished,

                    notes: item.notes,
                }));
                setAllFOSCLots(transformedData);
                setFetchLotDataStatus('success');
            } catch (e: any) {
                console.log("ERROR=", e);
                setFetchErrorDetails(String(e));
                setFetchLotDataStatus('failed');
            }
        }
        get_lots_data_from_server().then(() => {
        });
    }, [])

    const [loadEditorControls, setLoadEditorControls] = useState<'loading' | 'failed' | 'success'>('loading');
    // + Get the user roles
    useEffect(() => {
        try {
            // TODO: why is this even in async ? remove if not needed
            async function get_current_user() {
                const hasEditorRoles = hasRoles(userRoles, [221]);
                if (hasEditorRoles) {
                    const updatedColumnDefinitions = [
                        ...columnDefinitions,
                        {
                            headerName: "✍🏻",
                            field: "edit",
                            sortable: false,
                            filter: false,
                            width: 50,
                            pinned: "left",
                            cellClass: ["editor-only"],
                            headerTooltip: "Edit Lot",
                            cellRenderer: (params: any) => {
                                return (
                                    <a
                                        // href={`edit/${params.data.project_uid}`}
                                        className={"flex justify-center items-center m-0 p-0 cursor-pointer w-8 h-10"}
                                        data-id={params.data.id}
                                        onClick={()=>navigate(`/fosc/edit/${params.data.project_uid}`)}
                                    >
                                        <PiPencilSimpleFill/>
                                    </a>
                                )
                            },
                        }
                    ];
                    // @ts-ignore
                    setColumnDefinitions(updatedColumnDefinitions);
                }
            }

            if (loadEditorControls === 'loading') {
                get_current_user().then(() => {
                });
                setLoadEditorControls('success')
            }
        } catch (e) {
            setLoadEditorControls('failed');
        }
    }, [loadEditorControls, columnDefinitions])

    return (
        <MainLayout>
            {/*<div>*/}
            <div className="epc-container rounded-md">

                <div className="epc-header border border-b-0 rounded rounded-b-none py-2">
                    <div className="border-r flex items-center">
                        <h1 className="font-semibold lg:text-2xl pl-4"> Field Ops Scanning Console </h1>
                        {fetchLotDataStatus === 'loading' ?
                            <p className="ml-4 font-semibold text-secondary text-xl">Loading</p>
                            : fetchLotDataStatus === 'failed' ?
                                <p className="ml-4 font-semibold text-destructive text-xl">Failed</p>
                                :
                                <p className="ml-4 font-semibold text-primary text-xl">All-Lots</p>
                        }
                    </div>

                    <div className="flex mx-10">

                        <Button variant="outline" className="flex justify-center items-center"
                                onClick={() => navigate('/fosc')}>
                            <p className="pr-2"><TiArrowBack/></p>
                            Back to FOSC
                        </Button>

                        <FoscMenu/>
                    </div>
                </div>
                <div className="epc-body">
                    {fetchLotDataStatus === 'loading' ?
                        <div
                            id="nexus-epc-grid-container"
                            className="flex flex-col justify-center items-center"
                        >
                            <div className="space-y-4 m-8">
                                {[...Array(30)].map((_, index) => (
                                    <Skeleton key={index} className="rounded-full h-4 w-[80vw]"/>
                                ))}
                            </div>
                        </div>
                        : fetchLotDataStatus === 'failed' ?
                            <div
                                id="nexus-epc-grid-container"
                                className="flex flex-col justify-center items-center"
                            >
                                <p className="font-semibold text-destructive text-xl">Error fetching data</p>
                                <p>{fetchErrorDetails}</p>
                                <p>(If issue persists contact TEC Lab)</p>
                                <Button className="m-4">Reload</Button>
                            </div>
                            :
                            <div
                                // id="nexus-epc-grid-container"
                                className="ag-theme-alpine ag-theme-nexus"
                                // className="ag-theme-alpine"
                                style={{height: '100%'}}
                            >
                                <AgGridReact
                                    rowData={allFOSCLots}
                                    gridOptions={gridOptions}
                                    columnDefs={columnDefinitions}

                                />
                            </div>
                    }
                </div>

            </div>
        </MainLayout>
    );
}

export default FOSCAll;
