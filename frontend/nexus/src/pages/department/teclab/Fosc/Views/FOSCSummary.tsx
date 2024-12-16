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
// import {format} from "date-fns";
// import {PiPencilSimpleFill} from "react-icons/pi";
// import {hasRoles} from "@/features/utils/utils.ts";
// import {useUserRoles} from "@hooks/useUserRoles.ts";
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
        headerName: 'Community',
        children: [
            {headerName: 'Name', field: 'community_name', width: 250},
        ],
    },
    {
        headerName: 'Foundation',
        children: [
            {headerName: 'Unscanned', field: 'math_1',
                children: [{headerName: `total_1`, field: 'math_1'}]},
            {headerName: 'Scanned', field: 'value_1',
                children: [{headerName: 'total_2', field: 'value_1'}]},
            {headerName: 'Reported', field: 'value_2',
                children: [{headerName: 'total_3', field: 'value_2'}]},
        ],
    },
    {
        headerName: 'Slab',
        children: [
            {headerName: 'Unscanned', field: 'math_2',
                children: [{headerName: 'total_4', field: 'math_2'}]},
            {headerName: 'Scanned', field: 'value_3',
                children: [{headerName: 'total_5', field: 'value_3'}]},
            {headerName: 'Reported', field: 'value_4',
                children: [{headerName: 'total_6', field: 'value_4'}]},
        ],
    },
    {
        headerName: 'Frame',
        children: [
            {headerName: 'Unscanned', field: 'math_3',
                children: [{headerName: 'total_7', field: 'math_3'}]},
            {headerName: 'Scanned', field: 'value_5',
                children: [{headerName: 'total_8', field: 'value_5'}]},
            {headerName: 'Reported', field: 'value_6',
                children: [{headerName: 'total_9', field: 'value_6'}]},
        ],
    },
    {
        headerName: 'Mep',
        children: [
            {headerName: 'Unscanned', field: 'math_4',
                children: [{headerName: 'total_10', field: 'math_4'}]},
            {headerName: 'Scanned',field: 'value_7',
                children: [{headerName: 'total_11', field: 'value_7'}]},
            {headerName: 'Reported',field: 'value_8',
                children: [{headerName: 'total_12', field: 'value_8'}]},
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

const FOSCSummary = () => {
    const navigate = useNavigate();

    const axios = useAxiosPrivate();

    const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchErrorDetails, setFetchErrorDetails] = useState('');
    const [allFOSCLots, setAllFOSCLots] = useState([]);
    const [columnDefinitions, setColumnDefinitions] = useState(columnDefinitionsData);

    // + Fetch all FOSC lots
    useEffect(() => {
        const get_lots_data_from_server = async () => {
            try {
                const response = await axios.get('/department/teclab/fosc/summary');
                // console.log("response=", response);

                const backendData = response.data;

                // Data transformation
                const transformedData = backendData.map((item: any) => ({
                    community_name: item.community_name,
                    totals: item.values[8],

                    value_1: item.values[0],
                    value_2: item.values[1],
                    value_3: item.values[2],
                    value_4: item.values[3],
                    value_5: item.values[4],
                    value_6: item.values[5],
                    value_7: item.values[6],
                    value_8: item.values[7],

                    math_1: item.values[8] - item.values[10] - item.values[0],
                    math_2: item.values[8] - item.values[11] - item.values[2],
                    math_3: item.values[8] - item.values[4],
                    math_4: item.values[8] - item.values[12] - item.values[6],

                    total_1: item.values[13],
                    total_2: item.values[14],
                    total_3: item.values[15],
                    total_4: item.values[16],
                    total_5: item.values[17],
                    total_6: item.values[18],
                    total_7: item.values[19],
                    total_8: item.values[20],
                    total_9: item.values[21],
                    total_10: item.values[22],
                    total_11: item.values[23],
                    total_12: item.values[24],
                }));

                // Update column definitions with totals directly from the data
                const totalsFromData = transformedData[0];
                const updatedColumnDefinitions = columnDefinitionsData.map((col) => {
                    if (col.children) {
                        return {
                            ...col,
                            children: col.children.map((child) => ({
                                ...child,
                                // @ts-ignore
                                children: child.children?.map((subChild) => {
                                    const totalKey = subChild.headerName;
                                    return {
                                        ...subChild,
                                        headerName: `${totalsFromData[totalKey]}`,
                                    };
                                }),
                            })),
                        };
                    }
                    return col;
                });

                setColumnDefinitions(updatedColumnDefinitions);

                // @ts-ignore
                setAllFOSCLots(transformedData);
                setFetchLotDataStatus('success');
            } catch (e: any) {
                console.log("ERROR=", e);
                setFetchErrorDetails(String(e));
                setFetchLotDataStatus('failed');
            }
        };
        get_lots_data_from_server().then(() => {});
    }, []);

    return (
        <MainLayout>
            {/*<div>*/}
            <div className="epc-container rounded-md">

                <div className="epc-header border border-b-0 rounded rounded-b-none py-2">
                    <div className="border-r flex items-center">
                        <h1 className="font-semibold lg:text-2xl pl-4"> Field Ops Scans Console </h1>
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
                                    gridOptions={{ ...gridOptions, columnDefs: columnDefinitions }}
                                />
                            </div>
                    }
                </div>

            </div>
        </MainLayout>
    );
}

export default FOSCSummary;
