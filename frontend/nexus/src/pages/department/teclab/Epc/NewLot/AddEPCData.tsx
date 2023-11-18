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
import {TECLabEPCData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import FindProject from "@pages/Project/FindProject.tsx";
import {LoadingProgress} from "@components/common/LoadingProgress.tsx";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";


function AddEPCData() {
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
    const [selectedProjectsTECLabEPCData, setSelectedProjectsTECLabEPCData] = useState<TECLabEPCData>({

        // status
        // lot_status_finished: true,
        // lot_status_released: false,

        // Lot-info
        section_number: "",
        lot_number: "",

        notes: ""
    });


    function handleStateChange(pieceOfStateName: keyof TECLabEPCData, newValue: any) {
        setSelectedProjectsTECLabEPCData((prevLotData) => {
            return {
                ...prevLotData,
                [pieceOfStateName]: newValue
            }
        })
    }


    // + new form submit
    // + now a single form -> update EPC Data
    function updateEPCData(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        console.log("😄 NewLotData=", selectedProjectsTECLabEPCData);
        const makeServerRequest = async () => {
            try {
                const response = await axios.post('/department/teclab/epc/new',
                    {
                        "epc_data": selectedProjectsTECLabEPCData
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

    const [getProjectsStatus, setGetProjectsStatus] = useState<"initial" | "loading" | "failed">("initial");

    const [statusEPCDataFetch, setStatusEPCDataFetch] = useState<"initial" | "loading" | "failed" | "success">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);
    const [selectedProject, setSelectedProject] = useState(Array(searchResults.length).fill(false));

    const handleChooseProject = async (idx: number, targetProject: ResultProject) => {
        // select the project
        setSelectedProject(() => {
            const newState = Array(searchResults.length).fill(false);
            newState[idx] = true;
            return newState;
        })

        setStatusEPCDataFetch("loading");
        console.log("Handle Choose Project", targetProject);

        // + fetch project's epc data
        const fetchSelectedProjectTECLabEPCData = async () => {
            try {
                const response = await axios.get(`/department/teclab/epc/get/${targetProject.project_uid}`)
                console.log("Response for /get/{project_uid}: ", response);

                const lotData = response.data;

                // Data transformation
                const transformedData: TECLabEPCData = {
                    lot_status_finished: lotData.lot_status_finished,
                    lot_status_released: lotData.lot_status_released,

                    community: lotData.community,
                    section_number: lotData.section_number,
                    lot_number: lotData.lot_number,
                    contract_date: lotData.contract_date ? new Date(lotData.contract_date) : undefined,
                    contract_type: lotData.contract_type,
                    product_name: lotData.product_name,
                    elevation_name: lotData.elevation_name,

                    drafting_drafter: lotData.drafting_drafter,
                    drafting_assigned_on: lotData.drafting_assigned_on ? new Date(lotData.drafting_assigned_on) : undefined,
                    drafting_finished: lotData.drafting_finished ? new Date(lotData.drafting_finished) : undefined,

                    engineering_engineer: lotData.engineering_engineer,
                    engineering_sent: lotData.engineering_sent ? new Date(lotData.engineering_sent) : undefined,
                    engineering_received: lotData.engineering_received ? new Date(lotData.engineering_received) : undefined,

                    plat_engineer: lotData.plat_engineer,
                    plat_sent: lotData.plat_sent ? new Date(lotData.plat_sent) : undefined,
                    plat_received: lotData.plat_received ? new Date(lotData.plat_received) : undefined,

                    permitting_county_name: lotData.permitting_county_name,
                    permitting_submitted: lotData.permitting_submitted ? new Date(lotData.permitting_submitted) : undefined,
                    permitting_received: lotData.permitting_received ? new Date(lotData.permitting_received) : undefined,

                    bbp_posted: lotData.bbp_posted ? new Date(lotData.bbp_posted) : undefined,

                    notes: lotData.notes
                };
                console.log("transformedData=", transformedData);
                // Set the data to the lot-state
                setSelectedProjectsTECLabEPCData(transformedData);
                setStatusEPCDataFetch("success");

            } catch (e: any) {
                console.error(e);
            }
        };
        fetchSelectedProjectTECLabEPCData().then(()=>{})
    }
    useEffect(()=>{
        setSelectedProject(Array(searchResults.length).fill(false));
    }, [searchResults])

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

                <FindProject
                    status={getProjectsStatus}
                    setStatus={setGetProjectsStatus}
                    statusEPCDataFetch={statusEPCDataFetch}
                    setStatusEPCDataFetch={setStatusEPCDataFetch}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                />
                {searchResults.length > 0 &&
                  <div className="mt-0 m-4 p-4 rounded-md bg-default-bg2">
                    <p className="font-medium text-lg px-4">Results</p>
                      {/*<ScrollArea className="rounded-md p-2 px-4 overflow-x-auto">*/}
                    <div className="whitespace-nowrap flex w-full pb-4 px-4 overflow-x-scroll">
                        {searchResults.map((item, idx) =>
                            <button key={idx}
                                    className={`p-1 px-2 mx-2 rounded-md  font-medium ${selectedProject[idx] ? "border-primary border-2 bg-primary-bg0 text-white" : "bg-default-bg0"}`}
                                    onClick={() => handleChooseProject(idx, item)}
                            >
                                {item.project_id}
                            </button>
                        )}
                    </div>
                  </div>
                }
                {statusEPCDataFetch === 'loading' &&
                  <div className="mx-4"><LoadingProgress/></div>
                }
                {statusEPCDataFetch === 'success' &&
                  <>
                    <div className="bg-default-bg2 mx-4 p-4 pb-0 rounded-lg rounded-b-none">
                      <p className="pb-3 font-semibold text-2xl">TEC-Lab info</p>
                      <div className="m-4 mb-0 rounded-lg bg-default-bg2 flex flex-wrap justify-center"
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
                            <FieldDropDown id="1_community"
                                           name={"Community"}
                                           dropdownData={formData.all_communities}
                                           value={selectedProjectsTECLabEPCData.community}
                                           onUpdate={(newValue) => handleStateChange('community', newValue)}
                            />
                            <FieldText id="1_section"
                                       name={"Section"}
                                       value={selectedProjectsTECLabEPCData.section_number}
                                       onUpdate={(e) => handleStateChange('section_number', e.target.value)}
                            />
                            <FieldText id="1_lot_number"
                                       name={"Lot Number"}
                                       value={selectedProjectsTECLabEPCData.lot_number}
                                       onUpdate={(e) => handleStateChange('lot_number', e.target.value)}
                            />
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
                            </CardContent>
                          </Card>
                        </div>

                          {/* 6: Build By Plans */}
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
                          </CardContent>
                        </Card>

                          {/* 7: Notes */}
                        <Card className="min-w-[27%] m-4">
                          <CardHeader>
                            <CardTitle>Notes</CardTitle>
                            <CardDescription>TEC-Lab notes for the lot</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Textarea placeholder="Your notes here..."/>
                          </CardContent>
                        </Card>

                      </div>
                    </div>

                    <div
                      className="m-4 mt-0 pb-6 rounded-lg rounded-t-none flex justify-center items-center bg-default-bg2">
                      <Button variant="primary"
                              className="w-1/5"
                              onClick={updateEPCData}
                      >
                        SUBMIT
                      </Button>
                    </div>
                  </>
                }

            </div>
        </MainLayout>
    );
}


export default AddEPCData;