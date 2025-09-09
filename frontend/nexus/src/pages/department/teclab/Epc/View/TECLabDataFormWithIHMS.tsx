import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card.tsx";
import FieldDate from "@pages/department/teclab/Epc/helpers/FieldDate.tsx";
import FieldDropDown from "@pages/department/teclab/Epc/helpers/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/helpers/FieldText.tsx";
import FieldToggle from "@pages/department/teclab/Epc/helpers/FieldToggle.tsx";
import { Textarea } from "@components/ui/textarea.tsx";
import { Button } from "@components/ui/button.tsx";
import { TECLabEPCData } from "@pages/department/teclab/Epc/types/NewLotFormState.ts";
import React, { useEffect, useState } from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import LoadingSpinner2 from "@components/common/LoadingSpinner2.tsx";
import { cn } from "@/lib/utils.ts";


interface Iprops {
    project_id?: string;
    project_uid: string;
    statusEPCDataFetch: "initial" | "loading" | "failed" | "success";
    setStatusEPCDataFetch: React.Dispatch<React.SetStateAction<"initial" | "loading" | "failed" | "success">>;
    className?: string;
}

interface IIHMSFilteredHouseData {
    // Lot Info
    HOUSENUMBER?: string;
    // contract date
    CONTRACT_DATE?: string;
    // community
    DEVELOPMENTCODE?: string;
    // section
    BLOCKNUMBER?: string;
    // lot number
    LOTNUMBER?: string;
    // product
    MODELCODE?: string;
    // elevation
    ELEVATIONCODE?: string;

    // Drafting
    DRAFTEDBY?: string;
    LSLATECHANGEDATE?: string;

    PMREVIEWDATE?: string;  // pm review date(construction start date - 7 days)
    CONSTSTART_DATE?: string;// construction start

    // Engineering
    STRUCTURALCO?: string;
    ENGORDEREDDATE?: string;
    ENGRECVDDATE?: string;

    // Plat
    PLATORDEREDDATE?: string;
    PLATRECDATE?: string;

    // Permitting
    PERMITNUMBER?: string;
    PERMIT_DATE?: string;

    // Notes
    REMARKS?: string;
    NOTES?: string;
    COMMENTS?: string;

    // SuperIntendant
    SUPERUSERID?: string;
}


const TECLabDataFormWithIHMS = ({ project_id, project_uid, statusEPCDataFetch, setStatusEPCDataFetch, className }: Iprops) => {

    const [selectedProjectsTECLabEPCData, setSelectedProjectsTECLabEPCData] = useState<TECLabEPCData>({
        // these are the fields of type text, and must be initiated as empty string
        // or else there will be error on console, saying trying to control and un-controlled comp.
        project_id: "",
        project_uid: "",
        section_number: "",
        lot_number: "",
        notes: ""
    });

    type IHMSFetchStatus = "initial" | "loading" | "failed" | "success";
    const [statusIHMSDataFetch, setStatusIHMSDataFetch] = useState<IHMSFetchStatus>("initial");
    const [ihmsErrorMessage, setIhmsErrorMessage] = useState<string>("");   // only if there is any error
    // console.log("statusIHMSDataFetch::", statusIHMSDataFetch);
    const [selectedProjectIHMSData, setSelectedProjectIHMSData] = useState<IIHMSFilteredHouseData>();
    // console.log("selectedProjectIHMSData", selectedProjectIHMSData);

    function handleStateChange(pieceOfStateName: keyof TECLabEPCData, newValue: any) {
        setSelectedProjectsTECLabEPCData((prevLotData) => {
            return {
                ...prevLotData,
                [pieceOfStateName]: newValue
            }
        })
    }

    const axios = useAxiosPrivate();

    const [formData, setFormData] = useState({
        "all_communities": [],
        "all_products": [],
        "all_elevations": [],
        "all_drafters": [],
        "all_engineers": [],
        "all_plat_engineers": [],
        "all_counties": [],
        "all_homesiting_drafters": [],
        "all_field_ops_members": []
    })

    const [updateTECLabDataStatus, setUpdateTECLabDataStatus] = useState<"initial" | "loading" | "failed" | "success">("initial");
    // const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");

    // :: form -> update EPC Data
    function updateTECLabDataForProject(e: React.MouseEvent<HTMLButtonElement>, project_uid: string) {
        e.preventDefault();
        // console.log("😄 updateTECLabDataForProject=", e);
        // console.log("😄 project_uid=", project_uid);
        // console.log("😄 =selectedProjectsTECLabEPCData", selectedProjectsTECLabEPCData);
        const makeServerRequest = async () => {
            setUpdateTECLabDataStatus('loading');
            try {
                await axios.post('/department/teclab/epc/edit',
                    {
                        "project_uid": project_uid,
                        "epc_data": selectedProjectsTECLabEPCData
                    },
                    { headers: { "Content-Type": "application/json" } }
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
            const productsResponse = await axios.get('/department/teclab/products');
            const elevationsResponse = await axios.get('/department/teclab/elevations');
            const draftersResponse = await axios.get('/department/teclab/drafters');
            const engineersResponse = await axios.get('/eagle/engineers');
            const platEngineersResponse = await axios.get('/eagle/plat-engineers');
            const countiesResponse = await axios.get('/eagle/counties');
            const homesitingDraftersResponse = await axios.get('/department/teclab/homesiting-drafters')
            const fieldOpsMembersResponse = await axios.get('/department/teclab/fieldops-members')

            // Custom sort function to place "NONE" first
            const customSort = (arr) =>
                arr.sort((a, b) => (a === "NONE" ? -1 : b === "NONE" ? 1 : a.localeCompare(b)));

            setFormData({
                all_communities: customSort(communitiesResponse.data),
                all_products: customSort(productsResponse.data),
                all_elevations: customSort(elevationsResponse.data),
                all_drafters: customSort(draftersResponse.data),
                all_engineers: customSort(engineersResponse.data),
                all_plat_engineers: customSort(platEngineersResponse.data),
                all_counties: customSort(countiesResponse.data),
                all_homesiting_drafters: customSort(homesitingDraftersResponse.data),
                all_field_ops_members: customSort(fieldOpsMembersResponse.data)
            });
            // console.log("all_communities:", communitiesResponse.data);
            // console.log("all_products:", productsResponse.data);
            // console.log("all_elevations:", elevationsResponse.data);
            // console.log("all_drafters:", draftersResponse.data);
            // console.log("all_engineers:", engineersResponse.data);
            // console.log("all_plat_engineers:", platEngineersResponse.data);
            // console.log("all_counties:", countiesResponse.data);
            // console.log("all_homesiting_drafters:", homesitingDraftersResponse.data);
            // console.log("all_field_ops_members:", fieldOpsMembersResponse.data);
        }

        // console.log("EXECUTING THE useEffect - getData")
        getData();
    }, [axios])

    // + Fetch the chosen project's TEC-lab data
    useEffect(() => {
        const fetchSelectedProjectTECLabEPCData = async () => {
            setUpdateTECLabDataStatus('initial')
            try {
                const response = await axios.get(`/department/teclab/epc/get/${project_uid}`)
                // console.log("Response for /get/{project_uid}: ", response);

                const lotData = response.data;
                // console.log(":::lotData = ", lotData)

                // Data transformation
                const transformedData: TECLabEPCData = {
                    lot_status_finished: lotData.epc_data.lot_status_finished,
                    lot_status_released: lotData.epc_data.lot_status_released,

                    homesiting_requested_on: lotData.epc_data.homesiting_requested_on ? new Date(lotData.epc_data.homesiting_requested_on) : undefined,
                    homesiting_completed_on: lotData.epc_data.homesiting_completed_on ? new Date(lotData.epc_data.homesiting_completed_on) : undefined,
                    homesiting_completed_by: lotData.epc_data.homesiting_completed_by,
                    homesiting_notes: lotData.epc_data.homesiting_notes,

                    project_id: lotData.project_info.project_id,
                    project_uid: lotData.project_info.project_uid,

                    community: lotData.project_info.community,
                    section_number: lotData.project_info.section,
                    lot_number: lotData.project_info.lot_number,
                    contract_date: lotData.epc_data.contract_date ? new Date(lotData.epc_data.contract_date) : undefined,
                    contract_type: lotData.epc_data.contract_type,
                    product_name: lotData.epc_data.product_name,
                    elevation_name: lotData.epc_data.elevation_name,

                    drafting_drafter: lotData.epc_data.drafting_drafter,
                    drafting_assigned_on: lotData.epc_data.drafting_assigned_on ? new Date(lotData.epc_data.drafting_assigned_on) : undefined,
                    drafting_finished: lotData.epc_data.drafting_finished ? new Date(lotData.epc_data.drafting_finished) : undefined,
                    drafting_notes: lotData.epc_data.drafting_notes,

                    engineering_engineer: lotData.epc_data.engineering_engineer,
                    engineering_sent: lotData.epc_data.engineering_sent ? new Date(lotData.epc_data.engineering_sent) : undefined,
                    engineering_received: lotData.epc_data.engineering_received ? new Date(lotData.epc_data.engineering_received) : undefined,
                    engineering_notes: lotData.epc_data.engineering_notes,

                    plat_engineer: lotData.epc_data.plat_engineer,
                    plat_sent: lotData.epc_data.plat_sent ? new Date(lotData.epc_data.plat_sent) : undefined,
                    plat_received: lotData.epc_data.plat_received ? new Date(lotData.epc_data.plat_received) : undefined,
                    plat_notes: lotData.epc_data.plat_notes,

                    permitting_county_name: lotData.epc_data.permitting_county_name,
                    permitting_submitted: lotData.epc_data.permitting_submitted ? new Date(lotData.epc_data.permitting_submitted) : undefined,
                    permitting_received: lotData.epc_data.permitting_received ? new Date(lotData.epc_data.permitting_received) : undefined,
                    permitting_notes: lotData.epc_data.permitting_notes,
                    permithold_start: lotData.epc_data.permithold_start ? new Date(lotData.epc_data.permithold_start) : undefined,

                    bbp_posted: lotData.epc_data.bbp_posted ? new Date(lotData.epc_data.bbp_posted) : undefined,

                    notes: lotData.epc_data.notes
                };
                // console.log("transformedData=", transformedData);
                // Set the data to the lot-state
                setSelectedProjectsTECLabEPCData(transformedData);
                setStatusEPCDataFetch("success");
            } catch (e: any) {
                setStatusEPCDataFetch("failed");
                console.error(e);
            }
        };

        fetchSelectedProjectTECLabEPCData();
    }, [axios, setStatusEPCDataFetch, project_uid])

    // + Fetch the chosen project's IHMS data
    useEffect(() => {
        setStatusIHMSDataFetch("loading");
        const fetchSelectedProjectIHMSData = async () => {
            try {
                // const response = await axios.get(`/department/teclab/epc/ihms/get/${project_uid}`)
                const response = await axios.get(`/dev/ihms/get/${project_uid}`)
                console.log("fetchSelectedProjectIHMSData()->response", response);

                const data = response.data?.["IHMS_FILTERED_DATA"];
                if (!data || data["HOUSENUMBER"] === undefined || data["HOUSENUMBER"] === "") {
                    setStatusIHMSDataFetch("failed");
                    setIhmsErrorMessage(`Couldn't find ${selectedProjectsTECLabEPCData.project_id} on IHMS`);
                }
                else {
                    // set pm_review_date based on construction start date
                    if (data.CONSTSTART_DATE) {
                        const start_date = new Date(data.CONSTSTART_DATE);
                        const pm_review_date = new Date(start_date);
                        pm_review_date.setDate(start_date.getDate() - 7);
                        // Format as MM/DD/YYYY

                        const month = String(pm_review_date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-based
                        const day = String(pm_review_date.getDate()).padStart(2, "0");
                        const year = pm_review_date.getFullYear();

                        data.PMREVIEWDATE = `${month}/${day}/${year}`;
                    } else {
                        data.PMREVIEWDATE = "";
                    }
                    console.log("IHMS data after modifying on frontend", data);
                    setSelectedProjectIHMSData(data);
                    setStatusIHMSDataFetch("success");
                }
            }
            catch (e: any) {
                setStatusIHMSDataFetch("failed");
                setIhmsErrorMessage(e.message || "Unknown error occurred while fetching IHMS data");
                console.error("failed to get ihms data: ", e);
            }
        };
        fetchSelectedProjectIHMSData();
    }, [])

    return (
        <div className={cn(className)}>
            <div className="bg-default-bg2 mx-4 p-4 pb-0 relative border rounded-md">
                <div
                    className="flex justify-center absolute -top-4 left-0 right-0 ml-auto mr-auto w-fit bg-default-bg2 px-4">
                    {/* <p className="font-semibold text-2xl text-center">TEC-LAB Data</p> */}
                    {selectedProjectsTECLabEPCData.project_id &&
                        <p className="font-semibold text-2xl text-center text-primary">{selectedProjectsTECLabEPCData.project_id}</p>
                    }
                </div>

                {statusEPCDataFetch === 'loading' && <LoadingSpinner2 />}
                {statusEPCDataFetch === 'failed' &&
                    <p className="text-center text-xl text-red-500 font-semibold">
                        FAILED to get Project's TEC-Lab data
                    </p>
                }

                <>
                    <p className="flex justify-center">
                        {statusIHMSDataFetch === "loading" && <span className="text-yellow-500">IHMS DATA: Fetching...</span>}
                        {statusIHMSDataFetch === "failed" && <span className="text-red-400">IHMS DATA: Failed to Fetch</span>}
                        {statusIHMSDataFetch === "success" && <span className="text-blue-400">IHMS DATA: Successfully fetched</span>}
                    </p>
                </>
                {ihmsErrorMessage && <p className="flex justify-center text-red-400">{ihmsErrorMessage}</p>}

                {statusEPCDataFetch === 'success' &&
                    <div className="rounded-lg bg-default-bg2 flex flex-wrap justify-center"
                    >
                        {/* 1: Lot Info */}
                        <Card className="min-w-[27%] m-4">
                            <CardHeader>
                                <CardTitle>Lot Info</CardTitle>
                                <CardDescription>Lot's identity Information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldDropDown id="1_contract_type"
                                    name={"Contract Type"}
                                    dropdownData={["SPEC", "Permit & Hold", "Contract"]}
                                    value={selectedProjectsTECLabEPCData.contract_type}
                                    onUpdate={(newValue) => handleStateChange('contract_type', newValue)}
                                />
                                <FieldToggle id="1_finished"
                                    name="Finished"
                                    isChecked={selectedProjectsTECLabEPCData.lot_status_finished}
                                    onUpdate={() => handleStateChange('lot_status_finished', !selectedProjectsTECLabEPCData.lot_status_finished)}
                                />
                                <FieldToggle id="1_released"
                                    name="Released"
                                    isChecked={selectedProjectsTECLabEPCData.lot_status_released}
                                    onUpdate={() => handleStateChange('lot_status_released', !selectedProjectsTECLabEPCData.lot_status_released)}
                                />
                                <FieldDate id="1_contract_date"
                                    name="Contract Date"
                                    value={selectedProjectsTECLabEPCData.contract_date}
                                    onUpdate={(newValue) => handleStateChange('contract_date', newValue)}
                                />
                                <div className="w-[50%] my-2 border-b border border-gray-200 mx-auto" />
                                <FieldDropDown id="1_community"
                                    disabled
                                    name={"Community"}
                                    dropdownData={formData.all_communities}
                                    value={selectedProjectsTECLabEPCData.community}
                                    onUpdate={(newValue) => handleStateChange('community', newValue)}
                                />
                                <FieldText id="1_section"
                                    disabled
                                    name={"Section"}
                                    value={selectedProjectsTECLabEPCData.section_number}
                                    onUpdate={(e) => handleStateChange('section_number', e.target.value)}
                                />
                                <FieldText id="1_lot_number"
                                    disabled
                                    name={"Lot Number"}
                                    value={selectedProjectsTECLabEPCData.lot_number}
                                    onUpdate={(e) => handleStateChange('lot_number', e.target.value)}
                                />
                                {statusIHMSDataFetch === "success" &&
                                    <p className="text-slate-500">House Number: {selectedProjectIHMSData?.HOUSENUMBER}</p>
                                }
                                {statusIHMSDataFetch === "success" &&
                                    <p className="text-slate-500">DevelopmentCode: {selectedProjectIHMSData?.DEVELOPMENTCODE}</p>
                                }
                                <div className="w-[50%] my-2 border-b border border-gray-200 mx-auto" />
                                <FieldDropDown id="1_product"
                                    name={"Product"}
                                    dropdownData={formData.all_products}
                                    value={selectedProjectsTECLabEPCData.product_name}
                                    onUpdate={(newValue) => handleStateChange('product_name', newValue)}
                                />
                                <FieldDropDown id="1_elevation"
                                    name={"Elevation"}
                                    dropdownData={formData.all_elevations}
                                    value={selectedProjectsTECLabEPCData.elevation_name}
                                    onUpdate={(newValue) => handleStateChange('elevation_name', newValue)}
                                />
                                {statusIHMSDataFetch === "success" &&
                                    <p className="text-slate-500">ModelCode: {selectedProjectIHMSData?.MODELCODE}</p>
                                }
                                {statusIHMSDataFetch === "success" &&
                                    <p className="text-slate-500">ElevationCode: {selectedProjectIHMSData?.ELEVATIONCODE}</p>
                                }
                                <div className="w-[50%] my-2 border-b border border-gray-200 mx-auto" />
                                <FieldDate id="1_ph_tostart_date"
                                    name="P.H. Start"
                                    value={selectedProjectsTECLabEPCData.permithold_start}
                                    onUpdate={(newValue) => handleStateChange('permithold_start', newValue)}
                                />
                                {statusIHMSDataFetch === "success" &&
                                    <p className="text-slate-500">LS-LastChange: {selectedProjectIHMSData?.LSLATECHANGEDATE}</p>
                                }

                            </CardContent>
                        </Card>

                        {/* 2: Drafting, 3: Engineering */}
                        <div className="min-w-[27%] m-4">
                            <Card className="mb-5" id="new-lot-form-drafting">
                                <CardHeader>
                                    <CardTitle>Drafting</CardTitle>
                                    <CardDescription>Drafter and their time information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldDropDown id="2_drafter"
                                        name={"Drafter"}
                                        dropdownData={formData.all_drafters}
                                        value={selectedProjectsTECLabEPCData.drafting_drafter}
                                        onUpdate={newValue => handleStateChange('drafting_drafter', newValue)}
                                    />
                                    <FieldDate id="2_assigned"
                                        name="Assigned On"
                                        value={selectedProjectsTECLabEPCData.drafting_assigned_on}
                                        onUpdate={newDate => handleStateChange('drafting_assigned_on', newDate)}
                                    />
                                    <FieldDate id='2_finished'
                                        name='Finished On'
                                        value={selectedProjectsTECLabEPCData.drafting_finished}
                                        onUpdate={newDate => handleStateChange('drafting_finished', newDate)}
                                    />
                                    <Textarea id="2_drafting_notes" placeholder="Drafting specific notes ..."
                                        value={selectedProjectsTECLabEPCData.drafting_notes ?? ""}
                                        onChange={newNotes => handleStateChange('drafting_notes', newNotes.target.value)}
                                    />
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">DraftedBy: {selectedProjectIHMSData?.DRAFTEDBY}</p>
                                    }
                                </CardContent>
                            </Card>

                            <Card className="mt-5" id="new-lot-form-engineering">
                                <CardHeader>
                                    <CardTitle>Engineering</CardTitle>
                                    <CardDescription>Engineer and their time information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldDropDown id="3_engineer"
                                        name={"Engineer"}
                                        dropdownData={formData.all_engineers}
                                        value={selectedProjectsTECLabEPCData.engineering_engineer}
                                        onUpdate={newValue => handleStateChange('engineering_engineer', newValue)}
                                    />
                                    <FieldDate id="3_sent"
                                        name="Sent On"
                                        value={selectedProjectsTECLabEPCData.engineering_sent}
                                        onUpdate={newDate => handleStateChange('engineering_sent', newDate)}
                                    />
                                    <FieldDate id="3_received"
                                        name="Received On"
                                        value={selectedProjectsTECLabEPCData.engineering_received}
                                        onUpdate={newDate => handleStateChange('engineering_received', newDate)}
                                    />
                                    <Textarea id="3_engineering_notes" placeholder="Engineering specific notes ..."
                                        value={selectedProjectsTECLabEPCData.engineering_notes ?? ""}
                                        onChange={newNotes => handleStateChange('engineering_notes', newNotes.target.value)}
                                    />
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Engineer: {selectedProjectIHMSData?.STRUCTURALCO}</p>
                                    }
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Ordered: {selectedProjectIHMSData?.ENGORDEREDDATE}</p>
                                    }
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Received: {selectedProjectIHMSData?.ENGRECVDDATE}</p>
                                    }
                                </CardContent>
                            </Card>
                        </div>

                        {/* 4: Plat, 5: Permitting */}
                        <div className="min-w-[27%] m-4">
                            <Card className="mb-5" id="new-lot-form-plat">
                                <CardHeader>
                                    <CardTitle>Plat Engineer</CardTitle>
                                    <CardDescription>Plat-Engineer and their time information</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldDropDown id="4_plat_engineer"
                                        name={"Plat Engineer"}
                                        dropdownData={formData.all_plat_engineers}
                                        value={selectedProjectsTECLabEPCData.plat_engineer}
                                        onUpdate={newValue => handleStateChange('plat_engineer', newValue)}
                                    />
                                    <FieldDate id="4_sent"
                                        name="Sent on"
                                        value={selectedProjectsTECLabEPCData.plat_sent}
                                        onUpdate={newDate => handleStateChange('plat_sent', newDate)}
                                    />
                                    <FieldDate id="4_received"
                                        name="Received on"
                                        value={selectedProjectsTECLabEPCData.plat_received}
                                        onUpdate={newDate => handleStateChange('plat_received', newDate)}
                                    />
                                    <Textarea id="4_plat_notes" placeholder="Plat specific notes ..."
                                        value={selectedProjectsTECLabEPCData.plat_notes ?? ""}
                                        onChange={newNotes => handleStateChange('plat_notes', newNotes.target.value)}
                                    />
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Ordered: {selectedProjectIHMSData?.PLATORDEREDDATE}</p>
                                    }
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Received: {selectedProjectIHMSData?.PLATRECDATE}</p>
                                    }
                                </CardContent>
                            </Card>

                            <Card className="mt-5" id="new-lot-form-permitting">
                                <CardHeader>
                                    <CardTitle>Permitting</CardTitle>
                                    <CardDescription>Permitting details</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldDropDown id="5_county_name"
                                        name={"County Name"}
                                        dropdownData={formData.all_counties}
                                        value={selectedProjectsTECLabEPCData.permitting_county_name}
                                        onUpdate={newValue => handleStateChange('permitting_county_name', newValue)}
                                    />
                                    <FieldDate id="5_sent"
                                        name="Sent on"
                                        value={selectedProjectsTECLabEPCData.permitting_submitted}
                                        onUpdate={newDate => handleStateChange('permitting_submitted', newDate)}
                                    />
                                    <FieldDate id="5_received"
                                        name="Received on"
                                        value={selectedProjectsTECLabEPCData.permitting_received}
                                        onUpdate={newDate => handleStateChange('permitting_received', newDate)}
                                    />
                                    <Textarea id="5_permitting_notes" placeholder="Permitting specific notes ..."
                                        value={selectedProjectsTECLabEPCData.permitting_notes ?? ""}
                                        onChange={newNotes => handleStateChange('permitting_notes', newNotes.target.value)}
                                    />
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">Permit No.: {selectedProjectIHMSData?.PERMITNUMBER}</p>
                                    }
                                    {statusIHMSDataFetch === "success" &&
                                        <p className="text-slate-500">PermitDate: {selectedProjectIHMSData?.PERMIT_DATE}</p>
                                    }
                                </CardContent>
                            </Card>
                        </div>

                        {/* 6: Home Siting */}
                        <Card className="min-w-[27%] m-4">
                            <CardHeader>
                                <CardTitle>Home Siting</CardTitle>
                                <CardDescription>Home Siting details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldDate id="6_bbp"
                                    name="Requested On"
                                    value={selectedProjectsTECLabEPCData.homesiting_requested_on}
                                    onUpdate={newDate => handleStateChange('homesiting_requested_on', newDate)}
                                />
                                <FieldDate id="6_bbp"
                                    name="Completed On"
                                    value={selectedProjectsTECLabEPCData.homesiting_completed_on}
                                    onUpdate={newDate => handleStateChange('homesiting_completed_on', newDate)}
                                />
                                <FieldDropDown id="6_drafter"
                                    name={"Completed By"}
                                    dropdownData={formData.all_homesiting_drafters}
                                    value={selectedProjectsTECLabEPCData.homesiting_completed_by}
                                    onUpdate={newValue => handleStateChange('homesiting_completed_by', newValue)}
                                />
                                <Textarea id="6_homesiting_notes" placeholder="Home Siting specific notes ..."
                                    value={selectedProjectsTECLabEPCData.homesiting_notes ?? ""}
                                    onChange={newNotes => handleStateChange('homesiting_notes', newNotes.target.value)}
                                />
                                {/* <FieldDate id="homesiting_feedback_received_date" */}
                                {/*     name="Feedback Received On" */}
                                {/*     value={selectedProjectsTECLabEPCData.homesiting_feedback_received_date} */}
                                {/*     onUpdate={newDate => handleStateChange('homesiting_feedback_received_date', newDate)} */}
                                {/* /> */}

                            </CardContent>
                        </Card>

                        {/* 7: Build By Plans */}
                        <Card className="min-w-[27%] m-4">
                            <CardHeader>
                                <CardTitle>Build By Plans</CardTitle>
                                <CardDescription>BBP details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldDate id="6_bbp"
                                    name="Posted on"
                                    value={selectedProjectsTECLabEPCData.bbp_posted}
                                    onUpdate={newDate => handleStateChange('bbp_posted', newDate)}
                                />
                                {statusIHMSDataFetch === "success" &&
                                    <>
                                        <p className="text-slate-500">PM Review: {selectedProjectIHMSData?.PMREVIEWDATE}</p>
                                        <p className="text-slate-500">Con. Start: {selectedProjectIHMSData?.CONSTSTART_DATE}</p>
                                    </>
                                }
                            </CardContent>
                        </Card>


                        {/* 8: Notes */}
                        <Card className="min-w-[27%] m-4">
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                                <CardDescription>TEC-Lab notes for the lot</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea placeholder="General notes ..."
                                    value={selectedProjectsTECLabEPCData.notes ?? ""}
                                    onChange={newNotes => handleStateChange('notes', newNotes.target.value)}
                                />
                                {statusIHMSDataFetch === "success" &&
                                    <>
                                        <p className="text-slate-500">Notes: {selectedProjectIHMSData?.NOTES}</p>
                                        <p className="text-slate-500">Comments: {selectedProjectIHMSData?.COMMENTS}</p>
                                        <p className="text-slate-500">Remarks: {selectedProjectIHMSData?.REMARKS}</p>
                                        <p className="text-slate-500">SuperIntendant: {selectedProjectIHMSData?.SUPERUSERID}</p>
                                    </>
                                }
                            </CardContent>
                        </Card>

                    </div>
                }

                {/* Button that updates based on fetch status */}
                <div
                    className="m-4 mt-0 rounded-lg rounded-t-none flex justify-center items-center bg-default-bg2">
                    {updateTECLabDataStatus === 'initial' &&
                        <Button variant="primary"
                            className="w-1/5"
                            onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabEPCData.project_uid)}
                        >
                            SUBMIT
                        </Button>
                    }
                    {updateTECLabDataStatus === 'loading' &&
                        <Button variant="outline"
                            className="w-1/5"
                            onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabEPCData.project_uid)}
                        >
                            loading
                        </Button>
                    }
                    {updateTECLabDataStatus === 'success' &&
                        <Button variant="secondary"
                            className="w-1/5"
                            onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabEPCData.project_uid)}
                        >
                            Successfully updated
                        </Button>
                    }
                    {updateTECLabDataStatus === 'failed' &&
                        <Button variant="destructive"
                            className="w-1/5"
                            onClick={(e) => updateTECLabDataForProject(e, selectedProjectsTECLabEPCData.project_uid)}
                        >
                            Failed
                        </Button>
                    }
                </div>
            </div>


        </div>
    );
};

export default TECLabDataFormWithIHMS;
