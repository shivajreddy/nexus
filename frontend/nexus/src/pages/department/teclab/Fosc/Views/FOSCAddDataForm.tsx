import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card.tsx";
// import FieldDate from "@pages/department/teclab/Epc/helpers/FieldDate.tsx";
import FieldDropDown from "@pages/department/teclab/Epc/helpers/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/helpers/FieldText.tsx";
import FieldToggle from "@pages/department/teclab/Epc/helpers/FieldToggle.tsx";
import {Textarea} from "@components/ui/textarea.tsx";
import {Button} from "@components/ui/button.tsx";
import {TECLabFOSCData} from "@pages/department/teclab/Fosc/types/NewLotFormState.ts";
import React, {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";
import {cn} from "@/lib/utils.ts";


interface Iprops {
    project_id?: string;
    project_uid: string;
    statusFOSCDataFetch: "initial" | "loading" | "failed" | "success";
    setStatusFOSCDataFetch: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed" | "success">>;
    className?: string;
}


const FOSCAddDataForm = ({project_id, project_uid, statusFOSCDataFetch, setStatusFOSCDataFetch, className}: Iprops) => {

    const [selectedProjectsTECLabFOSCData, setSelectedProjectsTECLabFOSCData] = useState<TECLabFOSCData>({
        // these are the fields of type text, and must be initiated as empty string
        // or else there will be error on console, saying trying to control and un-controlled comp.
        project_id: "",
        project_uid: "",
        section_number: "",
        lot_number: "",
        notes: ""
    });

    function handleStateChange(pieceOfStateName: keyof TECLabFOSCData, newValue: any) {
        setSelectedProjectsTECLabFOSCData((prevLotData) => {
            return {
                ...prevLotData,
                [pieceOfStateName]: newValue
            }
        })
    }

    const axios = useAxiosPrivate();

    const [formData, setFormData] = useState({
        "all_communities": [],
        "all_field_ops_members": [],
        "all_directors": ["J.Marcinkevich", "T.Burke", "B.Keller", "J.Wood", "M.Mugler"],
        "all_pms": ["P.Monge", "D.Johnson", "T.Burke", "M.Hardy", "P.Riley", "E.Phelps", "L.Saunders",
            "A.Ghannam", "W.Wallace", "P.Shaw", "S.Lambert", "C.Montgomery", "J.Bruce", "R.Adenauer",
            "R.Kelley", "F.Cole", "J.Fleming", "D.Stosser", "M.Mugler"]
    })

    const [updateTECLabDataStatus, setUpdateTECLabDataStatus] = useState<"initial" | "loading" | "failed" | "success">("initial");
    // const [statusFOSCDataFetch, setStatusFOSCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");

    // :: form -> update FOSC Data
    function updateTECLabDataForProject(e: React.MouseEvent<HTMLButtonElement>, project_uid: string) {
        e.preventDefault();
        // console.log("😄 updateTECLabDataForProject=", e);
        console.log("😄 project_uid=", project_uid);
        console.log("😄 =selectedProjectsTECLabFOSCData", selectedProjectsTECLabFOSCData);
        const makeServerRequest = async () => {
            setUpdateTECLabDataStatus('loading');
            try {
                await axios.post('/department/teclab/fosc/edit',
                    {
                        "project_uid": project_uid,
                        "fosc_data": selectedProjectsTECLabFOSCData
                    },
                    {headers: {"Content-Type": "application/json"}}
                )
                setUpdateTECLabDataStatus('success');

            } catch (e) {
                console.error("Error sending post request", e);
                setUpdateTECLabDataStatus('failed')
            }
        }
        makeServerRequest().then(() => {
        });
    }

    // + Fetch the form's all drop-down fields data
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            const fieldOpsMembersResponse = await axios.get('/department/teclab/fieldops-members')
            setFormData({
                all_communities: communitiesResponse.data,
                all_field_ops_members: fieldOpsMembersResponse.data,
                all_directors: ["J.Marcinkevich", "T.Burke", "B.Keller", "J.Wood", "M.Mugler", "None"],
                all_pms: ["P.Monge", "D.Johnson", "T.Burke", "M.Hardy", "P.Riley", "E.Phelps", "L.Saunders",
                    "A.Ghannam", "W.Wallace", "P.Shaw", "S.Lambert", "C.Montgomery", "J.Bruce", "R.Adenauer",
                    "R.Kelley", "F.Cole", "J.Fleming", "D.Stosser", "M.Mugler"]
            })
        }

        getData().then(() => {
        });
    }, [])

    // + Fetch the chosen project's TEC-lab data
    useEffect(() => {
        const fetchSelectedProjectTECLabFOSCData = async () => {
            setUpdateTECLabDataStatus('initial')
            try {
                const response = await axios.get(`/department/teclab/fosc/get/${project_uid}`)
                // console.log("Response for /get/{project_uid}: ", response);

                const lotData = response.data;
                console.log(":::lotData = ", lotData)

                // Data transformation
                const transformedData: TECLabFOSCData = {
                    lot_status_started: lotData.fosc_data.lot_status_started,
                    lot_status_finished: lotData.fosc_data.lot_status_finished,

                    project_id: lotData.project_info.project_id,
                    project_uid: lotData.project_info.project_uid,

                    community: lotData.project_info.community,
                    section_number: lotData.project_info.section,
                    lot_number: lotData.project_info.lot_number,

                    assigned_pm: lotData.fosc_data.assigned_pm,
                    assigned_director: lotData.fosc_data.assigned_director,

                    foundation_needed: lotData.fosc_data.foundation_needed,
                    slab_needed: lotData.fosc_data.slab_needed,
                    mep_needed: lotData.fosc_data.mep_needed,
                    notes: lotData.fosc_data.notes
                };
                // console.log("transformedData=", transformedData);
                // Set the data to the lot-state
                setSelectedProjectsTECLabFOSCData(transformedData);
                setStatusFOSCDataFetch("success");

            } catch (e: any) {
                setStatusFOSCDataFetch("failed");
                console.error(e);
            }
        };
        fetchSelectedProjectTECLabFOSCData().then(() => {
        })
    }, [project_uid])

    return (
        <div className={cn(className)}>
            <div className="bg-default-bg2 mx-4 p-4 pb-0 relative border rounded-md">
                <div
                    className="flex justify-center absolute -top-4 left-0 right-0 ml-auto mr-auto w-fit bg-default-bg2 px-4">
                    <p className="font-semibold text-2xl text-center">FOSC Data</p>
                    {project_id &&
                      <p
                        className="font-semibold text-2xl text-center text-primary">&nbsp;:&nbsp;{project_id}</p>
                    }
                </div>

                {statusFOSCDataFetch === 'loading' &&
                  <LoadingSpinner2/>
                }

                {statusFOSCDataFetch === 'failed' &&
                  <p className="text-center text-xl text-red-500 font-semibold">
                    FAILED to get Project's FOSC data
                  </p>
                }

                {statusFOSCDataFetch === 'success' &&
                    <div className="rounded-lg bg-default-bg2 flex flex-wrap justify-center">

                        <div className="min-w-[30%]">
                            {/* 1: Lot Info */}
                            <Card className="m-4">
                                <CardHeader>
                                    <CardTitle>Lot Info</CardTitle>
                                    <CardDescription>Lot's identity Information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldToggle id="1_started"
                                                 name="Started"
                                                 isChecked={selectedProjectsTECLabFOSCData.lot_status_started}
                                                 onUpdate={() => handleStateChange('lot_status_started', !selectedProjectsTECLabFOSCData.lot_status_started)}
                                    />
                                    <FieldToggle id="1_finished"
                                                 name="Finished"
                                                 isChecked={selectedProjectsTECLabFOSCData.lot_status_finished}
                                                 onUpdate={() => handleStateChange('lot_status_finished', !selectedProjectsTECLabFOSCData.lot_status_finished)}
                                    />
                                    <FieldDropDown id="1_community"
                                                   disabled
                                                   name={"Community"}
                                                   dropdownData={formData.all_communities}
                                                   value={selectedProjectsTECLabFOSCData.community}
                                                   onUpdate={(newValue) => handleStateChange('community', newValue)}
                                    />
                                    <FieldText id="1_section"
                                               disabled
                                               name={"Section"}
                                               value={selectedProjectsTECLabFOSCData.section_number}
                                               onUpdate={(e) => handleStateChange('section_number', e.target.value)}
                                    />
                                    <FieldText id="1_lot_number"
                                               disabled
                                               name={"Lot Number"}
                                               value={selectedProjectsTECLabFOSCData.lot_number}
                                               onUpdate={(e) => handleStateChange('lot_number', e.target.value)}
                                    />
                                    {/* Supervisors */}
                                    <FieldDropDown id="2_pm"
                                                   name="PM"
                                                   dropdownData={formData.all_pms}
                                                   value={selectedProjectsTECLabFOSCData.assigned_pm}
                                                   onUpdate={(newValue) => handleStateChange('assigned_pm', newValue)}
                                    />
                                    <FieldDropDown id="2_director"
                                                   name={"Director"}
                                                   dropdownData={formData.all_directors}
                                                   value={selectedProjectsTECLabFOSCData.assigned_director}
                                                   onUpdate={(newValue) => handleStateChange('assigned_director', newValue)}
                                    />

                                </CardContent>
                            </Card>
                        </div>
                        <div className="min-w-[30%]">
                            {/* 5: Notes */}
                            <Card className="m-4">
                                <CardHeader>
                                    <CardTitle>Notes</CardTitle>
                                    <CardDescription>Field-Ops notes for the lot</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldToggle id="4_foundation_needed"
                                                 name="Foundation Needed? "
                                                 isChecked={selectedProjectsTECLabFOSCData.foundation_needed}
                                                 onUpdate={() => handleStateChange('foundation_needed', !selectedProjectsTECLabFOSCData.foundation_needed)}
                                    />
                                    <FieldToggle id="4_slab_needed"
                                                 name="Slab Needed?"
                                                 isChecked={selectedProjectsTECLabFOSCData.slab_needed}
                                                 onUpdate={() => handleStateChange('slab_needed', !selectedProjectsTECLabFOSCData.slab_needed)}
                                    />
                                    <FieldToggle id="4_frame_needed"
                                                 name="Frame Needed?"
                                                 isChecked={selectedProjectsTECLabFOSCData.frame_needed}
                                                 onUpdate={() => handleStateChange('frame_needed', !selectedProjectsTECLabFOSCData.frame_needed)}
                                    />
                                    <FieldToggle id="4_mep_needed"
                                                 name="MEP Needed?"
                                                 isChecked={selectedProjectsTECLabFOSCData.mep_needed}
                                                 onUpdate={() => handleStateChange('mep_needed', !selectedProjectsTECLabFOSCData.mep_needed)}
                                    />
                                    {/* ! TODO: provide the onChange handler for the Textarea content cuz i am giving the value to begin with*/}
                                    <Textarea placeholder="Your notes here..."
                                              value={selectedProjectsTECLabFOSCData.notes}
                                              onChange={newNotes => handleStateChange('notes', newNotes.target.value)}
                                    />
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                }

                {/* Button that updates based on fetch status */}
                        <div
                            className="m-4 mt-0 rounded-lg rounded-t-none flex justify-center items-center bg-default-bg2">
                            {updateTECLabDataStatus === 'initial' &&
                                <Button variant="primary"
                                        className="w-1/5"
                                        onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabFOSCData.project_uid)}
                                >
                                    SUBMIT
                                </Button>
                            }
                            {updateTECLabDataStatus === 'loading' &&
                                <Button variant="outline"
                                        className="w-1/5"
                                        onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabFOSCData.project_uid)}
                                >
                                    loading
                                </Button>
                            }
                            {updateTECLabDataStatus === 'success' &&
                                <Button variant="secondary"
                                        className="w-1/5"
                                        onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabFOSCData.project_uid)}
                                >
                                    Successfully updated
                                </Button>
                            }
                            {updateTECLabDataStatus === 'failed' &&
                                <Button variant="destructive"
                                        className="w-1/5"
                                        onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabFOSCData.project_uid)}
                                >
                                    Failed
                                </Button>
                            }
                        </div>
                    </div>


                    </div>
                    );
                };

                export default FOSCAddDataForm;
