import MainLayout from "@templates/MainLayout.tsx";

import FoscMenu from "./FoscMenu";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "@assets/pages/Epc/Epc.css"

import foscColumnDefinitions from "@pages/department/teclab/Fosc/Views/foscColumnDefinitions.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import { format } from "date-fns";
import { PiPencilSimpleFill } from "react-icons/pi";
import { hasRoles } from "@/features/utils/utils.ts";
import { useUserRoles } from "@hooks/useUserRoles.ts";
import { MdDownload, MdModeEditOutline } from "react-icons/md";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";
import { ColDef, ColGroupDef, GridOptions } from "ag-grid-community";
// import {useAppSelector} from "@redux/hooks.ts";
// import {selectCurrentUser} from "@/features/auth/authSlice.ts";



function Fosc() {
  const navigate = useNavigate();

  const axios = useAxiosPrivate();

  const userRoles = useUserRoles();

  // TODO: specify the type of the Lot object. which should be parallel to EPCLot from python
  const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
  const [fetchErrorDetails, setFetchErrorDetails] = useState('');
  const [allFOSCLots, setAllFOSCLots] = useState([]);


  useEffect(() => {
    const get_lots_data_from_server = async () => {
      try {
        const response = await axios.get('/department/teclab/fosc/live');
        // const response = await axios.get('/department/teclab/epc/all');
        // console.log("response=", response);
        // console.log("😆 response.data=", response.data);
        // setLotData(response.data);
        const backendData = response.data;
        // Data transformation
        const transformedData = backendData.map((item: any) => ({

          lot_status_started: item.lot_status_started,
          lot_status_finished: item.lot_status_finished,

          assigned_pm: item.assigned_pm,
          assigned_director: item.assigned_director,

          project_uid: item.project_uid,
          community_name: item.community,
          section_number: item.section_number,
          lot_number: item.lot_number,

          foundation_scan_status: item.foundation_scan_status,
          foundation_scan_date: item.foundation_scan_date ? format(new Date(item.foundation_scan_date), 'MM/dd/yyyy') : null,
          foundation_report_status: item.foundation_report_status,
          foundation_reporter: item.foundation_reporter,
          foundation_report_date: item.foundation_report_date ? format(new Date(item.foundation_report_date), 'MM/dd/yyyy') : null,
          foundation_uploaded: item.foundation_uploaded,

          slab_scan_status: item.slab_scan_status,
          slab_scan_date: item.slab_scan_date ? format(new Date(item.slab_scan_date), 'MM/dd/yyyy') : null,
          slab_report_status: item.slab_report_status,
          slab_reporter: item.slab_reporter,
          slab_report_date: item.slab_report_date ? format(new Date(item.slab_report_date), 'MM/dd/yyyy') : null,
          slab_uploaded: item.slab_uploaded,

          frame_scan_status: item.frame_scan_status,
          frame_scan_date: item.frame_scan_date ? format(new Date(item.frame_scan_date), 'MM/dd/yyyy') : null,
          frame_report_status: item.frame_report_status,
          frame_reporter: item.frame_reporter,
          frame_report_date: item.frame_report_date ? format(new Date(item.frame_report_date), 'MM/dd/yyyy') : null,
          frame_uploaded: item.frame_uploaded,

          mep_scan_status: item.mep_scan_status,
          mep_scan_date: item.mep_scan_date ? format(new Date(item.mep_scan_date), 'MM/dd/yyyy') : null,
          mep_report_status: item.mep_report_status,
          mep_reporter: item.mep_reporter,
          mep_report_date: item.mep_report_date ? format(new Date(item.mep_report_date), 'MM/dd/yyyy') : null,
          mep_uploaded: item.mep_uploaded,

          misc_scan_status: item.misc_scan_status,
          misc_report_status: item.misc_report_status,

          notes: item.notes

        }));
        // console.log("transformed 😇 data=", transformedData);
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

  const [finalfoscColDefs] = useState(() => {

    const viewerColDef = foscColumnDefinitions;
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
                  <PiPencilSimpleFill />
                </a>
              )

            }
          }
        ]
      }
    ];

    if (hasRoles(userRoles, [220])) {
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
  const foscGridOptions: GridOptions = {
    defaultColDef: defaultColumnSettings,
    columnDefs: finalfoscColDefs,
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
            <h1 className="font-semibold lg:text-2xl pl-4"> Field Ops Scans Console </h1>
            {fetchLotDataStatus === 'loading' ?
              <p className="ml-4 font-semibold text-secondary text-xl">Loading</p>
              : fetchLotDataStatus === 'failed' ?
                <p className="ml-4 font-semibold text-destructive text-xl">Failed</p>
                :
                <p className="ml-4 font-semibold text-primary text-xl">LIVE</p>
            }
          </div>
          <div className="flex mx-10">
            {hasRoles(userRoles, [221]) &&
              <div className="flex justify-center items-center bg-default-bg1">
                <Button
                  className="min-w-[10em]"
                  onClick={() => navigate('edit')}>

                  <p className="pr-2"><MdModeEditOutline /></p>
                  Search & Update
                </Button>
              </div>
            }
            {/* {hasRoles(userRoles, [221]) && */}
            {/*   <div className="flex justify-center items-center bg-default-bg1 mx-3"> */}
            {/*     <Button */}
            {/*       className="min-w-[10em]" */}
            {/*       onClick={() => navigate('add')}> */}
            {/**/}
            {/*       <p className="pr-2"><MdDownload /></p> */}
            {/*       Add Project */}
            {/*     </Button> */}
            {/*   </div> */}
            {/* } */}
            {hasRoles(userRoles, [223]) &&
              <FoscMenu />
            }
          </div>
        </div>
        <div className="epc-body">
          {fetchLotDataStatus === 'loading' ?
            <div className="flex flex-col justify-center items-center">
              <LoadingSpinner2 />
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
                style={{ height: '100%' }}
              >
                <AgGridReact
                  rowData={allFOSCLots}
                  gridOptions={foscGridOptions}
                />
              </div>
          }
        </div>

      </div>
    </MainLayout>
  );
}

export default Fosc;
