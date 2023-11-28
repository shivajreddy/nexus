import MainLayout from "@/templates/MainLayout";

import {AgGridReact} from "ag-grid-react";

// import EpcMenu from "./EpcMenu";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import "@/assets/pages/Epc/Epc.css"


// import {rowData, columnDefinitions} from "./demoData.ts";
// import {BsPlusCircleFill} from "react-icons/bs";
import {useNavigate} from "react-router-dom";
// import {CgMenuGridO} from "react-icons/cg";
import {Button} from "@components/ui/button.tsx";
import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {format} from "date-fns";
import {PiPencilSimpleFill} from "react-icons/pi";
import {hasRoles} from "@/features/utils/utils.ts";
import {useUserRoles} from "@hooks/useUserRoles.ts";
import {MdModeEditOutline} from "react-icons/md";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";


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


function Epc() {
    const navigate = useNavigate();

    const axios = useAxiosPrivate();

    const userRoles = useUserRoles();

    // TODO: specify the type of the Lot object. which should be parallel to EPCLot from python
    const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchErrorDetails, setFetchErrorDetails] = useState('');
    const [allEPCLots, setAllEPCLots] = useState([]);

    const [columnDefinitions, setColumnDefinitions] = useState(columnDefinitionsData)

    // + Fetch all EPC lots
    useEffect(() => {
        const get_lots_data_from_server = async () => {
            try {
                const response = await axios.get('/department/teclab/epc/live');
                // console.log("response=", response);
                // console.log("😆 response.data=", response.data);
                // setLotData(response.data);
                const backendData = response.data;

                // Data transformation
                const transformedData = backendData.map((item: any) => ({
                    project_uid: item.project_uid,
                    community_name: item.community,
                    section_number: item.section_number,
                    lot_number: item.lot_number,
                    contract_date: item.contract_date ? format(new Date(item.contract_date), 'MM/dd/yyyy') : null,
                    product: item.product_name,
                    elevation: item.elevation_name,
                    // Format date and handle null values as needed for another date fields
                    drafting_assigned_on_date: item.drafting_assigned_on ? format(new Date(item.drafting_assigned_on), 'MM/dd/yyyy') : null,
                    drafting_finished_date: item.drafting_finished ? format(new Date(item.drafting_finished), 'MM/dd/yyyy') : null,
                    engineering_sent: item.engineering_sent ? format(new Date(item.engineering_sent), 'MM/dd/yyyy') : null,
                    engineering_received: item.engineering_received ? format(new Date(item.engineering_received), 'MM/dd/yyyy') : null,
                    plat_sent: item.plat_sent ? format(new Date(item.plat_sent), 'MM/dd/yyyy') : null,
                    plat_received: item.plat_received ? format(new Date(item.plat_received), 'MM/dd/yyyy') : null,
                    permit_submitted: item.permitting_submitted ? format(new Date(item.permitting_submitted), 'MM/dd/yyyy') : null,
                    permit_received: item.permitting_received ? format(new Date(item.permitting_received), 'MM/dd/yyyy') : null,
                    bbp_posted: item.bbp_posted ? format(new Date(item.bbp_posted), 'MM/dd/yyyy') : null,
                    drafter_name: item.drafting_drafter,
                    engineer_name: item.engineering_engineer,
                    plat_name: item.plat_engineer,
                    county: item.permitting_county_name,
                    notes: item.notes,
                }));
                // console.log("transformed 😇 data=", transformedData);
                setAllEPCLots(transformedData);
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
                const hasEditorRoles = hasRoles(userRoles, [101]);
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
                                        onClick={() => navigate(`edit/${params.data.project_uid}`)}
                                    >
                                        <PiPencilSimpleFill/>
                                    </a>
                                )
                            },
                        }
                    ];
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
            <div className="epc-container rounded-md m-4 bg-default-bg2">
                <div className="epc-header border border-b-0 rounded rounded-b-none py-2">
                    <div className="border-r flex items-center">
                        <h1 className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console </h1>
                        {fetchLotDataStatus === 'loading' ?
                            <p className="ml-4 font-semibold text-secondary text-xl">Loading</p>
                            : fetchLotDataStatus === 'failed' ?
                                <p className="ml-4 font-semibold text-destructive text-xl">Failed</p>
                                :
                                <p className="ml-4 font-semibold text-primary text-xl">LIVE</p>
                        }
                    </div>

                    <div className="flex mx-10">
                        {hasRoles(userRoles, [101]) &&
                          <div className="flex justify-center items-center bg-default-bg1">
                            <Button onClick={() => navigate('edit')} className="min-w-[10em]">
                              <p className="pr-2"><MdModeEditOutline/></p>
                              Search & Update
                            </Button>
                          </div>
                        }
                        {/*<div className="flex justify-center items-center ml-8 bg-default-bg2">*/}
                        {/*    <button*/}
                        {/*        className="flex items-center border border-b0 bg-default-bg2 hover:bg-default-fg2 hover:text-background p-1.5 px-4 rounded-md"*/}
                        {/*        onClick={() => navigate('/epc/all-lots')}*/}
                        {/*    >*/}
                        {/*        <p className="pr-2"><CgMenuGridO/></p>*/}
                        {/*        All Lots*/}
                        {/*    </button>*/}
                        {/*</div>*/}
                        {/*<EpcMenu/>*/}
                    </div>
                </div>
                <div className="epc-body">
                    {fetchLotDataStatus === 'loading' ?
                        <div className="flex flex-col justify-center items-center">
                            <LoadingSpinner2/>
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
                                    rowData={allEPCLots}
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

export default Epc;
