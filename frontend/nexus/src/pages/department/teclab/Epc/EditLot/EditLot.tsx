import MainLayout from "@templates/MainLayout.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card.tsx";
import FieldToggle from "@pages/department/teclab/Epc/NewLot/FieldToggle.tsx";
import FieldDate from "@pages/department/teclab/Epc/NewLot/FieldDate.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import {Textarea} from "@components/ui/textarea.tsx";
import React, {useEffect, useState} from "react";
import "@assets/pages/Epc/NewLot.css"
import {INewLotData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";


function EditLot() {
    const navigate = useNavigate();
    const axios = useAxiosPrivate()

    const {project_uid} = useParams<{ project_uid: string }>();

    const [data, setData] = useState({
        "all_communities": [],
        "all_products": [],
        "all_elevations": [],
        "all_drafters": [],
        "all_engineers": [],
        "all_plat_engineers": [],
        "all_counties": []
    })

    // + Fetch the data
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            const productsResponse = await axios.get('/department/teclab/core-models');
            const elevationsResponse = await axios.get('/department/teclab/elevations');
            const draftersResponse = await axios.get('/department/teclab/drafters');
            const engineersResponse = await axios.get('/eagle/engineers');
            const platEngineersResponse = await axios.get('/eagle/plat-engineers');
            const countiesResponse = await axios.get('/eagle/counties');
            setData({
                all_communities: communitiesResponse.data,
                all_products: productsResponse.data,
                all_elevations: elevationsResponse.data,
                all_drafters: draftersResponse.data,
                all_engineers: engineersResponse.data,
                all_plat_engineers: platEngineersResponse.data,
                all_counties: countiesResponse.data
            })
        }
        getData().then(()=>{});
    }, [])

    // + fetch the project data
    useEffect(()=>{
        async function fetchProjectData() {
            const response = await axios.patch('/department/teclab/epc/edit', {
                "project_uid": project_uid
            })
            console.log("fetch_project response=", response);
        }
        fetchProjectData().then(()=>{});
    },[])

    // New Lot Form State
    const [newLotData, setNewLotData] = useState<INewLotData>({
        // Lot-info
        contract_type: "",
        lot_status_finished: false,
        lot_status_released: false,
        contract_date: undefined,
        community_name: "",
        section_number: "",
        lot_number: "",
        product_name: "",
        elevation_name: "",

        // Drafting
        drafting_drafter: "",
        drafting_dread_line: undefined,
        drafting_finished: undefined,

        // Engineering
        engineering_engineer: "",
        engineering_sent: undefined,
        engineering_expected: undefined,
        engineering_received: undefined,

        // Plat
        plat_engineer: "",
        plat_sent: undefined,
        plat_expected: undefined,
        plat_received: undefined,

        //Permitting
        permitting_county_name: "",
        permitting_expected_submit: undefined,
        permitting_submitted: undefined,
        permitting_received: undefined,

        // Build By Plans
        bbp_expected_post: undefined,
        bbp_posted: undefined,

        // Notes
        notes: ""
    });

    // + new form submit
    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log("😄 NewLotData=", newLotData);
    }


    return (
        <MainLayout>
            <p>{project_uid}</p>
            <div className="border rounded bg-default-bg1">
                <div className="epc-header rounded rounded-b-none py-2 border-b">
                    <div className="border-r flex items-center">
                        <p className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console</p>
                        <p className="ml-4 font-semibold text-primary text-xl">Edit Lot</p>
                    </div>

                    <div className="flex mx-10 items-center">
                        {/* TODO: this should be role specific*/}
                        <div className="flex justify-center items-center">
                            <Button variant="outline" className="flex justify-center items-center"
                                    onClick={() => navigate('/epc')}>
                                <p className="pr-2"><TiArrowBack/></p>
                                Back to EPC
                            </Button>
                            <EpcMenu/>
                        </div>
                    </div>
                </div>

                <div id="new-lot-form-container" className="rounded-lg rounded-t-none bg-default-bg2">

                    {/* 1: Lot Info */}
                    <Card className="new-lot-section" id="new-lot-form-lot-info">
                        <CardHeader>
                            <CardTitle>Lot Info</CardTitle>
                            <CardDescription>Lot's identity Information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldDropDown id="1_contract_type"
                                           name={"Contract Type"}
                                           data={["SPEC", "Permit & Hold", "Contract"]}
                                           pieceOfStateName="contract_type"
                                           setNewLotData={setNewLotData}
                            />
                            <FieldToggle id="1_finished"
                                         name="Finished"
                                         isChecked={newLotData.lot_status_finished}
                                         pieceOfStateName="lot_status_finished"
                                         setNewLotData={setNewLotData}
                            />
                            <FieldToggle id="1_released"
                                         name="Released"
                                         isChecked={newLotData.lot_status_released}
                                         pieceOfStateName="lot_status_released"
                                         setNewLotData={setNewLotData}
                            />
                            <FieldDate id="1_contract_date" name="Contract Date"/>
                            <FieldDropDown id="1_community"
                                           name={"Community"}
                                           data={data.all_communities}
                                           pieceOfStateName="community_name"
                                           setNewLotData={setNewLotData}
                            />
                            <FieldText id="1_section"
                                       name={"Section"}
                                       value={newLotData.section_number}
                                       pieceOfStateName="section_number"
                                       setNewLotData={setNewLotData}
                            />
                            <FieldText id="1_lot_number"
                                       name={"Lot Number"}
                                       value={newLotData.lot_number}
                                       pieceOfStateName="section_number"
                                       setNewLotData={setNewLotData}
                            />
                            <FieldDropDown id="1_product"
                                           name={"Product"}
                                           data={data.all_communities}
                                           pieceOfStateName="product_name"
                                           setNewLotData={setNewLotData}
                            />
                            <FieldDropDown id="1_elevation"
                                           name={"Elevation"}
                                           data={data.all_elevations}
                                           pieceOfStateName="elevation_name"
                                           setNewLotData={setNewLotData}
                            />
                        </CardContent>
                    </Card>

                    {/* 2: Drafting */}
                    <Card className="new-lot-section" id="new-lot-form-drafting">
                        <CardHeader>
                            <CardTitle>Drafting</CardTitle>
                            <CardDescription>Drafter and their time information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldDropDown id="2_drafter"
                                           name={"Drafter"}
                                           data={data.all_drafters}
                                           pieceOfStateName="drafting_drafter"
                                           setNewLotData={setNewLotData}
                            />
                            <FieldDate id="2_assigned" name="Assigned On"/>
                            <FieldDate id="2_finished" name="Finished On"/>
                        </CardContent>
                    </Card>

                    <div className="new-lot-section">
                        {/* 3: Engineering */}
                        <Card className="mb-4" id="new-lot-form-engineering">
                            <CardHeader>
                                <CardTitle>Engineering</CardTitle>
                                <CardDescription>Engineer and their time information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldDropDown id="3_engineer"
                                               name={"Engineer"}
                                               data={data.all_engineers}
                                               pieceOfStateName="engineering_engineer"
                                               setNewLotData={setNewLotData}
                                />
                                <FieldDate id="3_sent" name="Sent On"/>
                                <FieldDate id="3_received" name="Received On"/>
                            </CardContent>
                        </Card>

                        {/* 4: Plat*/}
                        <Card className="mt-4" id="new-lot-form-plat">
                            <CardHeader>
                                <CardTitle>Plat Engineer</CardTitle>
                                <CardDescription>Plat-Engineer and their time information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldDropDown id="4_plat_engineer"
                                               name={"Plat Engineer"}
                                               data={data.all_plat_engineers}
                                               pieceOfStateName="plat_engineer"
                                               setNewLotData={setNewLotData}
                                />
                                <FieldDate id="4_sent" name="Sent on"/>
                                <FieldDate id="4_received" name="Received on"/>
                            </CardContent>
                        </Card>
                    </div>

                    {/* 5: Permitting */}
                    <Card className="new-lot-section" id="new-lot-form-permitting">
                        <CardHeader>
                            <CardTitle>Permitting</CardTitle>
                            <CardDescription>Permitting details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldDropDown id="5_county_name"
                                           name={"County Name"}
                                           data={data.all_counties}
                                           pieceOfStateName="permitting_county_name"
                                           setNewLotData={setNewLotData}
                            />
                            <FieldDate id="5_sent" name="Sent on"/>
                            <FieldDate id="5_received" name="Received on"/>
                        </CardContent>
                    </Card>

                    {/* 6: Build By Plans*/}
                    <Card className="new-lot-section" id="new-lot-form-bbp">
                        <CardHeader>
                            <CardTitle>Build By Plans</CardTitle>
                            <CardDescription>BBP details</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FieldDate id="6_bbp" name="Posted on"/>
                        </CardContent>
                    </Card>

                    {/* 7: Notes */}
                    <Card className="new-lot-section" id="new-lot-form-notes">
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>[TEC-Lab only]Notes about the lot</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea placeholder="Notes aboue the lot"/>
                        </CardContent>
                    </Card>

                </div>

                <div className="py-6 flex justify-center items-center bg-default-bg2">
                    <Button variant="primary"
                            className="w-1/5"
                            onClick={handleSubmit}
                    >SUBMIT</Button>
                </div>

            </div>
        </MainLayout>
    );
}

export default EditLot;
