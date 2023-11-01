import MainLayout from "@templates/MainLayout.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";
import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@components/ui/card.tsx";
import FieldToggle from "@pages/department/teclab/Epc/NewLot/FieldToggle.tsx";
import FieldDate from "@pages/department/teclab/Epc/NewLot/FieldDate.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import {Textarea} from "@components/ui/textarea.tsx";
import React, {useEffect, useState} from "react";
import "@assets/pages/Epc/NewLot.css"
import {EPCData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import {makeIssue} from "zod";


function NewLot() {
    const navigate = useNavigate();
    const axios = useAxiosPrivate()

    const [formData, setFormData] = useState({
        "all_communities": [],
        "all_products": [],
        "all_elevations": [],
        "all_drafters": [],
        "all_engineers": [],
        "all_plat_engineers": [],
        "all_counties": []
    })

    // + Fetch the formData
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            const productsResponse = await axios.get('/department/teclab/products');
            const elevationsResponse = await axios.get('/department/teclab/elevations');
            const draftersResponse = await axios.get('/department/teclab/drafters');
            const engineersResponse = await axios.get('/eagle/engineers');
            const platEngineersResponse = await axios.get('/eagle/plat-engineers');
            const countiesResponse = await axios.get('/eagle/counties');
            setFormData({
                all_communities: communitiesResponse.data,
                all_products: productsResponse.data,
                all_elevations: elevationsResponse.data,
                all_drafters: draftersResponse.data,
                all_engineers: engineersResponse.data,
                all_plat_engineers: platEngineersResponse.data,
                all_counties: countiesResponse.data
            })
        }

        getData().then(() => {
        });
    }, [])

    // New Lot Form State
    const [newLotState, setNewLotState] = useState<EPCData>({

        // status
        lot_status_finished: true,
        // lot_status_released: false,

        // Lot-info
        section_number: "",
        lot_number: "",

        notes: ""
    });


    function handleStateChange(pieceOfStateName: keyof EPCData, newValue: any) {
        setNewLotState((prevLotData) => {
            return {
                ...prevLotData,
                [pieceOfStateName]: newValue
            }
        })
    }


    // + new form submit
    function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log("😄 NewLotData=", newLotState);
        const makeServerRequest = async () => {
            try {
                const response = await axios.post('/department/teclab/epc/new',
                    {
                        "epc_data": newLotState
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
                console.log("Response=", response);
            } catch (e) {
                console.error("Error sending post request", e);
            }
        }
        makeServerRequest().then(() => {
        });
    }


    return (
        <MainLayout>
            <div className="border rounded bg-default-bg1">
                <div className="epc-header rounded rounded-b-none py-2 border-b">
                    <div className="border-r flex items-center">
                        <p className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console</p>
                        <p className="ml-4 font-semibold text-primary text-xl">New Lot</p>
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
                                           dropdownData={["SPEC", "Permit & Hold", "Contract"]}
                                           value={newLotState.contract_type}
                                           onUpdate={(newValue) => handleStateChange('contract_type', newValue)}
                            />
                            <FieldToggle id="1_finished"
                                         name="Finished"
                                         isChecked={newLotState.lot_status_finished}
                                         onUpdate={()=>handleStateChange('lot_status_finished', !newLotState.lot_status_finished)}
                            />
                            <FieldToggle id="1_released"
                                         name="Released"
                                         isChecked={newLotState.lot_status_released}
                                         onUpdate={()=>handleStateChange('lot_status_released', !newLotState.lot_status_released)}
                            />
                            <FieldDate id="1_contract_date"
                                       name="Contract Date"
                                       value={newLotState.contract_date}
                                       onUpdate={(newValue) => handleStateChange('contract_date', newValue)}
                            />
                            <FieldDropDown id="1_community"
                                           name={"Community"}
                                           dropdownData={formData.all_communities}
                                           value={newLotState.community}
                                           onUpdate={(newValue) => handleStateChange('community', newValue)}
                            />
                            <FieldText id="1_section"
                                       name={"Section"}
                                       value={newLotState.section_number}
                                       onUpdate={(e) => handleStateChange('section_number', e.target.value)}
                            />
                            <FieldText id="1_lot_number"
                                       name={"Lot Number"}
                                       value={newLotState.lot_number}
                                       onUpdate={(e) => handleStateChange('lot_number', e.target.value)}
                            />
                            <FieldDropDown id="1_product"
                                           name={"Product"}
                                           dropdownData={formData.all_products}
                                           value={newLotState.product_name}
                                           onUpdate={(newValue) => handleStateChange('product_name', newValue)}
                            />
                            <FieldDropDown id="1_elevation"
                                           name={"Elevation"}
                                           dropdownData={formData.all_elevations}
                                           value={newLotState.elevation_name}
                                           onUpdate={(newValue)=>handleStateChange('elevation_name', newValue)}
                            />
                        </CardContent>
                    </Card>

                    {/*/!* 2: Drafting *!/*/}
                    {/*<Card className="new-lot-section" id="new-lot-form-drafting">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Drafting</CardTitle>*/}
                    {/*        <CardDescription>Drafter and their time information</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <FieldDropDown id="2_drafter"*/}
                    {/*                       name={"Drafter"}*/}
                    {/*                       data={formData.all_drafters}*/}
                    {/*                       pieceOfStateName="drafting_drafter"*/}
                    {/*                       setNewLotData={setNewLotState}*/}
                    {/*        />*/}
                    {/*        <FieldDate id="2_assigned" name="Assigned On"/>*/}
                    {/*        <FieldDate id="2_finished" name="Finished On"/>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    {/*<div className="new-lot-section">*/}
                    {/*    /!* 3: Engineering *!/*/}
                    {/*    <Card className="mb-4" id="new-lot-form-engineering">*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle>Engineering</CardTitle>*/}
                    {/*            <CardDescription>Engineer and their time information</CardDescription>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent>*/}
                    {/*            <FieldDropDown id="3_engineer"*/}
                    {/*                           name={"Engineer"}*/}
                    {/*                           data={formData.all_engineers}*/}
                    {/*                           pieceOfStateName="engineering_engineer"*/}
                    {/*                           setNewLotData={setNewLotState}*/}
                    {/*            />*/}
                    {/*            <FieldDate id="3_sent" name="Sent On"/>*/}
                    {/*            <FieldDate id="3_received" name="Received On"/>*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}

                    {/*    /!* 4: Plat*!/*/}
                    {/*    <Card className="mt-4" id="new-lot-form-plat">*/}
                    {/*        <CardHeader>*/}
                    {/*            <CardTitle>Plat Engineer</CardTitle>*/}
                    {/*            <CardDescription>Plat-Engineer and their time information</CardDescription>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardContent>*/}
                    {/*            <FieldDropDown id="4_plat_engineer"*/}
                    {/*                           name={"Plat Engineer"}*/}
                    {/*                           data={formData.all_plat_engineers}*/}
                    {/*                           pieceOfStateName="plat_engineer"*/}
                    {/*                           setNewLotData={setNewLotState}*/}
                    {/*            />*/}
                    {/*            <FieldDate id="4_sent" name="Sent on"/>*/}
                    {/*            <FieldDate id="4_received" name="Received on"/>*/}
                    {/*        </CardContent>*/}
                    {/*    </Card>*/}
                    {/*</div>*/}

                    {/*/!* 5: Permitting *!/*/}
                    {/*<Card className="new-lot-section" id="new-lot-form-permitting">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Permitting</CardTitle>*/}
                    {/*        <CardDescription>Permitting details</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <FieldDropDown id="5_county_name"*/}
                    {/*                       name={"County Name"}*/}
                    {/*                       data={formData.all_counties}*/}
                    {/*                       pieceOfStateName="permitting_county_name"*/}
                    {/*                       setNewLotData={setNewLotState}*/}
                    {/*        />*/}
                    {/*        <FieldDate id="5_sent" name="Sent on"/>*/}
                    {/*        <FieldDate id="5_received" name="Received on"/>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    {/*/!* 6: Build By Plans*!/*/}
                    {/*<Card className="new-lot-section" id="new-lot-form-bbp">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Build By Plans</CardTitle>*/}
                    {/*        <CardDescription>BBP details</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <FieldDate id="6_bbp" name="Posted on"/>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    {/*/!* 7: Notes *!/*/}
                    {/*<Card className="new-lot-section" id="new-lot-form-notes">*/}
                    {/*    <CardHeader>*/}
                    {/*        <CardTitle>Notes</CardTitle>*/}
                    {/*        <CardDescription>[TEC-Lab only]Notes about the lot</CardDescription>*/}
                    {/*    </CardHeader>*/}
                    {/*    <CardContent>*/}
                    {/*        <Textarea placeholder="Notes aboue the lot"/>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

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

export default NewLot;