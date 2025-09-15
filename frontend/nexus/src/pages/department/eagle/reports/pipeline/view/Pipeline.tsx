import MainLayout from "@templates/MainLayout.tsx";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

import "@assets/pages/Epc/Epc.css"

import epcColumnDefinitions from "@pages/department/teclab/Epc/View/epcColumnDefinitions.ts";
import { useNavigate } from "react-router-dom";
import { Button } from "@components/ui/button.tsx";
import { useEffect, useMemo, useState } from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import { format } from "date-fns";
import { hasRoles } from "@/features/utils/utils.ts";
import { useUserRoles } from "@hooks/useUserRoles.ts";
import { MdEmail, MdModeEditOutline } from "react-icons/md";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";
import { ColDef, ColGroupDef, GridOptions } from "ag-grid-community";
import { CgMenuGridO } from "react-icons/cg";
import { FaPencil } from "react-icons/fa6";



export default function Pipeline() {
    const navigate = useNavigate();
    const axios = useAxiosPrivate();
    const userRoles = useUserRoles();

    const [fetchLotDataStatus, setFetchLotDataStatus] = useState<'loading' | 'failed' | 'success'>('loading');
    const [fetchErrorDetails, setFetchErrorDetails] = useState('');
    const [pipelineLots, setPipelineLots] = useState([]);

    // + Fetch IHMS DATA, through backend
    useEffect(() => {
        console.log("Going to fetch Lots from IHMS via backend api");
    }, []);

    return (
        <>
            <p> Pipe Line Report</p>
            // show fetched time
        // show last ihms update time
        </>
    )

}

