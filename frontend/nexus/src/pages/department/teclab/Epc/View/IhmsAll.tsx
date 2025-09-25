import MainLayout from "@templates/MainLayout.tsx";
import { AgGridReact } from "ag-grid-react";
import EpcMenu from "./EpcMenu.tsx";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@assets/pages/Epc/Epc.css";

import { useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button.tsx";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import { format } from "date-fns";
import { PiPencilSimpleFill } from "react-icons/pi";
import { hasRoles } from "@/features/utils/utils.ts";
import { useUserRoles } from "@hooks/useUserRoles.ts";
import { Skeleton } from "@components/ui/skeleton.tsx";
import { TiArrowBack } from "react-icons/ti";

import ihmsPipelineColumnDefinitions from "./ihmsPipelineColumnDefinitions.ts";

const defaultColumnSettings = {
    sortable: true,
    filter: true,
    resizable: true,
    width: 120,
    wrapHeaderText: true,
    autoHeaderHeight: true,
};

const gridOptions = {
    defaultColDef: defaultColumnSettings,
    columnDefs: ihmsPipelineColumnDefinitions,
    groupHeaderHeight: 40,
    headerHeight: 30,
    floatingFiltersHeight: 50,
    pivotHeaderHeight: 100,
    pivotGroupHeaderHeight: 50,
};

function IhmsAll() {
    const navigate = useNavigate();
    const axios = useAxiosPrivate();
    const userRoles = useUserRoles();

    const [fetchStatus, setFetchStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchError, setFetchError] = useState('');
    const [ihmsData, setIHMSData] = useState<any[]>([]);
    const [columnDefinitions, setColumnDefinitions] = useState(ihmsPipelineColumnDefinitions);

    // Fetch IHMS pipeline data
    useEffect(() => {
        const fetchIHMSData = async () => {
            try {

                const response = await axios.get('/dev/pipeline/work2');
                const backendData = response.data.data; // assuming the structure {data: [...], ...}

                // Format dates in a readable way
                const transformedData = backendData.map((item: any) => ({
                    ...item,
                    conststart_date: item.conststart_date ? format(new Date(item.conststart_date), 'MM/dd/yyyy') : null,
                    arb_submit: item.arb_submit ? format(new Date(item.arb_submit), 'MM/dd/yyyy') : null,
                    arb_approved: item.arb_approved ? format(new Date(item.arb_approved), 'MM/dd/yyyy') : null,
                    permit_applied: item.permit_applied ? format(new Date(item.permit_applied), 'MM/dd/yyyy') : null,
                    permit_date: item.permit_date ? format(new Date(item.permit_date), 'MM/dd/yyyy') : null,
                    bbp_posted: item.bbp_posted ? format(new Date(item.bbp_posted), 'MM/dd/yyyy') : null,
                    po_released: item.po_released ? format(new Date(item.po_released), 'MM/dd/yyyy') : null,
                    ratified_date: item.ratified_date ? format(new Date(item.ratified_date), 'MM/dd/yyyy') : null,
                    estsettl_date: item.estsettl_date ? format(new Date(item.estsettl_date), 'MM/dd/yyyy') : null,
                    foundation_start: item.foundation_start ? format(new Date(item.foundation_start), 'MM/dd/yyyy') : null,
                    foundation_finish: item.foundation_finish ? format(new Date(item.foundation_finish), 'MM/dd/yyyy') : null,
                    earlystartdate: item.earlystartdate ? format(new Date(item.earlystartdate), 'MM/dd/yyyy') : null,
                    earlyfinishdate: item.earlyfinishdate ? format(new Date(item.earlyfinishdate), 'MM/dd/yyyy') : null,
                    latestartdate: item.latestartdate ? format(new Date(item.latestartdate), 'MM/dd/yyyy') : null,
                    latefinishdate: item.latefinishdate ? format(new Date(item.latefinishdate), 'MM/dd/yyyy') : null,
                    selectionduedate: item.selectionduedate ? format(new Date(item.selectionduedate), 'MM/dd/yyyy') : null,
                    lifstloptduedate: item.lifstloptduedate ? format(new Date(item.lifstloptduedate), 'MM/dd/yyyy') : null,
                    lscompletedate: item.lscompletedate ? format(new Date(item.lscompletedate), 'MM/dd/yyyy') : null,
                }));

                setIHMSData(transformedData);
                setFetchStatus('success');
            } catch (e: any) {
                setFetchError(String(e));
                setFetchStatus('failed');
            }
        };

        fetchIHMSData();
    }, [axios]);

    // Add edit column if user has role 211
    useEffect(() => {
        const addEditColumn = async () => {
            if (hasRoles(userRoles, [211])) {
                setColumnDefinitions([
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
                        cellRenderer: (params: any) => (
                            <a
                                className="flex justify-center items-center m-0 p-0 cursor-pointer w-8 h-10"
                                onClick={() => navigate(`/epc/edit/${params.data.project_uid}`)}
                            >
                                <PiPencilSimpleFill />
                            </a>
                        ),
                    },
                ]);
            }
        };

        addEditColumn();
    }, [columnDefinitions, navigate, userRoles]);

    return (
        <MainLayout>
            <div className="epc-container rounded-md">

                <div className="epc-header border border-b-0 rounded rounded-b-none py-2 flex justify-between items-center px-4">
                    <div className="flex items-center border-r pr-4 justify-between w-full">
                        <h1 className="font-semibold lg:text-2xl">Eagle - Pipeline</h1>

                        {fetchStatus === 'loading' && <p className="ml-4 font-semibold text-secondary text-xl">Loading</p>}
                        {fetchStatus === 'failed' && <p className="ml-4 font-semibold text-destructive text-xl">Failed</p>}

                        {fetchStatus === 'success' &&
                            <div className="ml-auto flex items-center">
                                <p className="text-primary text-lg">Last Updated Time: </p>
                                <p className="ml-1 text-primary text-lg">{/* Your value here */}</p>
                            </div>
                        }
                    </div>

                    {/* <div className="flex gap-4"> */}
                    {/*     <Button variant="outline" onClick={() => navigate('/epc')} className="flex items-center gap-2"> */}
                    {/*         <TiArrowBack /> Back to EPC */}
                    {/*     </Button> */}
                    {/*     <EpcMenu /> */}
                    {/* </div> */}
                </div>

                <div className="epc-body">
                    {fetchStatus === 'loading' && (
                        <div className="flex flex-col justify-center items-center py-8">
                            <div className="space-y-4 w-full px-4">
                                {[...Array(30)].map((_, index) => (
                                    <Skeleton key={index} className="rounded-full h-4 w-full" />
                                ))}
                            </div>
                        </div>
                    )}

                    {fetchStatus === 'failed' && (
                        <div className="flex flex-col justify-center items-center py-8">
                            <p className="font-semibold text-destructive text-xl">Error fetching data</p>
                            <p>{fetchError}</p>
                            <p>(If issue persists contact TEC Lab)</p>
                            <Button className="m-4" onClick={() => window.location.reload()}>Reload</Button>
                        </div>
                    )}

                    {fetchStatus === 'success' && (
                        <div className="ag-theme-alpine ag-theme-nexus" style={{ height: '100%' }}>
                            <AgGridReact
                                rowData={ihmsData}
                                gridOptions={gridOptions}
                                columnDefs={columnDefinitions}
                            />
                        </div>
                    )}
                </div>

            </div>
        </MainLayout>
    );
}

export default IhmsAll;
