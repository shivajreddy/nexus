import MainLayout from "@templates/MainLayout.tsx";
import TECLabDataForm from "@pages/department/teclab/Epc/NewLot/TECLabDataForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {TiArrowBack} from "react-icons/ti";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import {useState} from "react";


function EditTECLabData() {
    const navigate = useNavigate();
    const {project_uid} = useParams<{ project_uid: string }>();
    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");

    return (
        <MainLayout>
            <div className="epc-header bg-default-bg2 m-4 mb-0 rounded-md rounded-b-none py-2 border-b border-b0">
                <div className="border-r flex items-center">
                    <p className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console</p>
                    <p className="ml-4 font-semibold text-secondary text-xl">EDIT</p>
                </div>

                <div className="flex mx-10 items-center">
                    {/* TODO: this should be role specific*/}
                    <div className="flex justify-center items-center">
                        <Button variant="default" className="flex justify-center items-center"
                                onClick={() => navigate('/epc')}>
                            <p className="pr-2"><TiArrowBack/></p>
                            Back to EPC
                        </Button>
                        <EpcMenu/>
                    </div>
                </div>
            </div>
            <TECLabDataForm
                statusEPCDataFetch={statusEPCDataFetch}
                setStatusEPCDataFetch={setStatusEPCDataFetch}
                project_uid={project_uid ? project_uid : ""}
            />
        </MainLayout>
    );
}


export default EditTECLabData;
