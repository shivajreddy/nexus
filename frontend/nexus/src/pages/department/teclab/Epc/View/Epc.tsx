import MainLayout from "@templates/MainLayout.tsx";

import EpcMenu from "./EpcMenu";

import {AgGridReact} from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "@assets/pages/Epc/Epc.css"

import epcColumnDefinitions from "@pages/department/teclab/Epc/View/epcColumnDefinitions.ts";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {useEffect, useMemo, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {format} from "date-fns";
import {PiPencilSimpleFill} from "react-icons/pi";
import {hasRoles} from "@/features/utils/utils.ts";
import {useUserRoles} from "@hooks/useUserRoles.ts";
import {MdEmail, MdModeEditOutline} from "react-icons/md";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";
import {BASE_URL} from "@/services/api";
import {ColDef, ColGroupDef, GridOptions} from "ag-grid-community";
import {useAppSelector} from "@redux/hooks.ts";
import {selectCurrentUser} from "@/features/auth/authSlice.ts";


function Epc() {
    const navigate = useNavigate();

    const axios = useAxiosPrivate();

    const userRoles = useUserRoles();

    // TODO: specify the type of the Lot object. which should be parallel to EPCLot from python
    const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchErrorDetails, setFetchErrorDetails] = useState('');
    const [allEPCLots, setAllEPCLots] = useState([]);

    // + Fetch all EPC lots
    useEffect(() => {
        const get_lots_data_from_server = async () => {
            try {
                const response = await axios.get('/department/teclab/epc/live');
                // const response = await axios.get('/department/teclab/epc/all');
                // console.log("response=", response);
                // console.log("😆 response.data=", response.data);
                // setLotData(response.data);
                const backendData = response.data;
                // Data transformation
                const transformedData = backendData.map((item: any) => ({

                    lot_status_finished: item.lot_status_finished,
                    lot_status_released: item.lot_status_released,

                    homesiting_completed_by: item.homesiting_completed_by,
                    homesiting_completed_on: item.homesiting_completed_on ? format(new Date(item.homesiting_completed_on), 'MM/dd/yyyy') : null,

                    project_uid: item.project_uid,
                    community_name: item.community,
                    section_number: item.section_number,
                    lot_number: item.lot_number,
                    contract_type: item.contract_type,
                    // contract_date: item.contract_date ? format(new Date(item.contract_date), 'MM/dd/yyyy') : null,
                    contract_date: item.contract_date ? format(new Date(item.contract_date), 'yyyy/MM/dd') : null,
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



    // + Set column defs based on user roles
    const [finalEpcColDefs] = useState(() => {

            const viewerColDef = epcColumnDefinitions;
            const editorColDef: ColGroupDef[] = [

                {
                    headerName: "✍🏻",
                    children: [
                        {
                            field: 'edit',
                            headerName: '',
                            sortable: false,
                            filter: false,
                            width: 50,
                            pinned: "left",
                            cellClass: ["editor-only"],
                            headerTooltip: "Edit Lot",
                            resizable: false,
                            suppressMovable: true,
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

                            }
                        }
                    ]
                }
            ];
            if (hasRoles(userRoles, [210])) {
                return [...viewerColDef, ...editorColDef];
            }
            return viewerColDef
        }
    );

    const defaultColumnSettings: ColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        width: 120,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        floatingFilter: true,
        suppressMenu: true,
        lockVisible: true,
    }

    const paginationPageSizeSelector = useMemo<number[] | boolean>(() => {
        return [50, 100, 200];
    }, []);
    const epcGridOptions: GridOptions = {
        defaultColDef: defaultColumnSettings,
        columnDefs: finalEpcColDefs,
        groupHeaderHeight: 30,
        headerHeight: 30,
        floatingFiltersHeight: 40,
        pivotHeaderHeight: 100,
        pivotGroupHeaderHeight: 50,
        // columnHoverHighlight: true,
        // suppressMovableColumns: true,
        pagination: true,
        rowSelection: 'multiple',
        paginationPageSize: 100,
        paginationPageSizeSelector: paginationPageSizeSelector
    }

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
                        {hasRoles(userRoles, [211]) &&
                          <div className="flex justify-center items-center bg-default-bg1">
                            <Button onClick={() => navigate('edit')} className="min-w-[10em]">
                              <p className="pr-2"><MdModeEditOutline/></p>
                              Search & Update
                            </Button>
                          </div>
                        }
                        {hasRoles(userRoles, [213]) &&
                          <div className="flex justify-center items-center bg-default-bg1 mx-4">
                            <Button onClick={() => axios.get(BASE_URL + '/department/teclab/epc/epc-backlog-tracker')}
                                    className="min-w-[10em]">
                              <p className="pr-2"><MdEmail/></p>
                              Email Me Backlog
                            </Button>
                          </div>
                        }
                        {/* :: For now only dev can see this, make it visible once menu is finished */}
                        {hasRoles(userRoles, [999]) && <EpcMenu/>}
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
                                // className="ag-theme-alpine ag-theme-nexus"
                                className="ag-theme-quartz ag-theme-nexus"
                                // className="ag-theme-alpine"
                                style={{height: '100%'}}
                            >
                                <AgGridReact
                                    rowData={allEPCLots}
                                    gridOptions={epcGridOptions}
                                />
                            </div>
                    }
                </div>

            </div>
        </MainLayout>
    );
}

export default Epc;
