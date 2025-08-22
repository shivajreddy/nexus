import MainLayout from "@/templates/MainLayout"
import TECLabDataFormWithIHMS from "../department/teclab/Epc/View/TECLabDataFormWithIHMS"
import { useState } from "react";
import { useParams } from "react-router-dom";

// 
function get_data_from_server() {
    console.log("GOING TO TRY TO GET DATA FROM SERVER");
}


export function EpcProjectWithIHMS() {
    get_data_from_server();

    // const { project_uid } = useParams<{ project_uid: string }>();
    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");
    return (
        <MainLayout>
            <p>epc with ihms</p>
            <TECLabDataFormWithIHMS
                className="mx-4 p-10 bg-white"
                statusEPCDataFetch={statusEPCDataFetch}
                setStatusEPCDataFetch={setStatusEPCDataFetch}
                project_uid="4405954e-a06e-4179-bbd6-9d2debbafb40"
            />
        </MainLayout>
    )
}

// project_uid="4405954e-a06e-4179-bbd6-9d2debbafb40"
// project_uid={project_uid ? project_uid : "4405954e-a06e-4179-bbd6-9d2debbafb40"}
