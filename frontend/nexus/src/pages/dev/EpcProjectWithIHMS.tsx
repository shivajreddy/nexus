import MainLayout from "@/templates/MainLayout"
import TECLabDataFormWithIHMS from "./TECLabDataFormWithIHMS"

// 
function get_data_from_server() {
    console.log("asdfjl ");
}


export function EpcProjectWithIHMS() {
    get_data_from_server();
    return (
        <MainLayout>
            <p>epc with ihms</p>
            <TECLabDataFormWithIHMS
                className="mx-4 p-10 bg-white"
                statusEPCDataFetch={statusEPCDataFetch}
                setStatusEPCDataFetch={setStatusEPCDataFetch}
                project_uid={project_uid ? project_uid : ""}
            />
        </MainLayout>
    )
}

