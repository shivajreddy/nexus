import MainLayout from "@templates/MainLayout.tsx";
import FOSCDataForm from "@pages/department/teclab/Fosc/Views/FOSCDataForm.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useState} from "react";


function EditFOSCData() {
    const navigate = useNavigate();
    const {project_uid} = useParams<{ project_uid: string }>();
    const [statusFOSCDataFetch, setStatusFOSCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");

    return (
        <MainLayout>
            <div className="epc-header bg-default-bg2 m-4 mb-0 rounded-md rounded-b-none py-2 border-b border-b0">
                <div className="border-r flex items-center">
                    <p className="font-semibold lg:text-2xl pl-4"> Field Ops Scans Console</p>
                    <p className="ml-4 font-semibold text-secondary text-xl">EDIT</p>
                </div>

                <div className="flex mx-10 items-center">
                    {/* TODO: this should be role specific*/}
                    <div className="flex justify-center items-center">
                        <Button variant="default" className="flex justify-center items-center"
                                onClick={() => navigate('/fosc')}>
                            <p className="pr-2"><TiArrowBack/></p>
                            Back to FOSC
                        </Button>
                    </div>
                </div>
            </div>
            <FOSCDataForm
                className="mx-4 p-10 bg-white"
                statusFOSCDataFetch={statusFOSCDataFetch}
                setStatusFOSCDataFetch={setStatusFOSCDataFetch}
                project_uid={project_uid ? project_uid : ""}
            />
        </MainLayout>
    );
}


export default EditFOSCData;
