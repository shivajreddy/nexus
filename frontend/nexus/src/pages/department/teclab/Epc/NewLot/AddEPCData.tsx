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
import {EPCData} from "@pages/department/teclab/Epc/NewLot/NewLotFormState.tsx";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import FindProject from "@pages/Project/FindProject.tsx";
import {LoadingProgress} from "@components/common/LoadingProgress.tsx";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import {Loader2} from "lucide-react";


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
    const [newLotState, setNewLotState] = useState<EPCData>({

        // status
        // lot_status_finished: true,
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
    // + now a single form -> update EPC Data
    function updateEPCData(e: React.MouseEvent<HTMLButtonElement>) {
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
        const fetchEPCData = async () => {
            try {
                const response = await axios.get(`/department/teclab/epc/get/${targetProject.project_uid}`)
                console.log("response=", response)
                setStatusEPCDataFetch("success");
            } catch (e) {
                console.error("error in getting project's epc data", e);
                setStatusEPCDataFetch("failed");
            }
        }
        fetchEPCData();
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
                            {/*<EpcMenu/>*/}
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
                  <div className="">
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
                                           value={newLotState.contract_type}
                                           onUpdate={(newValue) => handleStateChange('contract_type', newValue)}
                            />
                            <FieldToggle id="1_finished"
                                         name="Finished"
                                         isChecked={newLotState.lot_status_finished}
                                         onUpdate={() => handleStateChange('lot_status_finished', !newLotState.lot_status_finished)}
                            />
                            <FieldToggle id="1_released"
                                         name="Released"
                                         isChecked={newLotState.lot_status_released}
                                         onUpdate={() => handleStateChange('lot_status_released', !newLotState.lot_status_released)}
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
                                           onUpdate={(newValue) => handleStateChange('elevation_name', newValue)}
                            />
                          </CardContent>
                        </Card>

                          {/* 2: Drafting */}
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
                                             value={newLotState.drafting_drafter}
                                             onUpdate={newValue => handleStateChange('drafting_drafter', newValue)}
                              />
                              <FieldDate id="2_assigned"
                                         name="Assigned On"
                                         value={newLotState.drafting_assigned_on}
                                         onUpdate={newDate => handleStateChange('drafting_assigned_on', newDate)}
                              />
                              <FieldDate id='2_finished'
                                         name='Finished On'
                                         value={newLotState.drafting_finished}
                                         onUpdate={newDate => handleStateChange('drafting_finished', newDate)}
                              />
                            </CardContent>
                          </Card>

                            {/* 3: Engineering */}
                          <Card className="mt-5" id="new-lot-form-engineering">
                            <CardHeader>
                              <CardTitle>Engineering</CardTitle>
                              <CardDescription>Engineer and their time information</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <FieldDropDown id="3_engineer"
                                             name={"Engineer"}
                                             dropdownData={formData.all_engineers}
                                             value={newLotState.engineering_engineer}
                                             onUpdate={newValue => handleStateChange('engineering_engineer', newValue)}
                              />
                              <FieldDate id="3_sent"
                                         name="Sent On"
                                         value={newLotState.engineering_sent}
                                         onUpdate={newDate => handleStateChange('engineering_sent', newDate)}
                              />
                              <FieldDate id="3_received"
                                         name="Received On"
                                         value={newLotState.engineering_received}
                                         onUpdate={newDate => handleStateChange('engineering_received', newDate)}
                              />
                            </CardContent>
                          </Card>
                        </div>


                        <div className="min-w-[27%] m-4">
                            {/* 4: Plat*/}
                          <Card className="mb-5" id="new-lot-form-plat">
                            <CardHeader>
                              <CardTitle>Plat Engineer</CardTitle>
                              <CardDescription>Plat-Engineer and their time information</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <FieldDropDown id="4_plat_engineer"
                                             name={"Plat Engineer"}
                                             dropdownData={formData.all_plat_engineers}
                                             value={newLotState.plat_engineer}
                                             onUpdate={newValue => handleStateChange('plat_engineer', newValue)}
                              />
                              <FieldDate id="4_sent"
                                         name="Sent on"
                                         value={newLotState.plat_sent}
                                         onUpdate={newDate => handleStateChange('plat_sent', newDate)}
                              />
                              <FieldDate id="4_received"
                                         name="Received on"
                                         value={newLotState.plat_received}
                                         onUpdate={newDate => handleStateChange('plat_received', newDate)}
                              />
                            </CardContent>
                          </Card>

                            {/* 5: Permitting */}
                          <Card className="mt-5" id="new-lot-form-permitting">
                            <CardHeader>
                              <CardTitle>Permitting</CardTitle>
                              <CardDescription>Permitting details</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <FieldDropDown id="5_county_name"
                                             name={"County Name"}
                                             dropdownData={formData.all_counties}
                                             value={newLotState.permitting_county_name}
                                             onUpdate={newValue => handleStateChange('permitting_county_name', newValue)}
                              />
                              <FieldDate id="5_sent"
                                         name="Sent on"
                                         value={newLotState.permitting_submitted}
                                         onUpdate={newDate => handleStateChange('permitting_submitted', newDate)}
                              />
                              <FieldDate id="5_received"
                                         name="Received on"
                                         value={newLotState.permitting_received}
                                         onUpdate={newDate => handleStateChange('permitting_received', newDate)}
                              />
                            </CardContent>
                          </Card>
                        </div>

                          {/* 6: Build By Plans*/}
                        <Card className="min-w-[27%] m-4">
                          <CardHeader>
                            <CardTitle>Build By Plans</CardTitle>
                            <CardDescription>BBP details</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <FieldDate id="6_bbp"
                                       name="Posted on"
                                       value={newLotState.bbp_posted}
                                       onUpdate={newDate => handleStateChange('bbp_posted', newDate)}
                            />
                          </CardContent>
                        </Card>

                          {/*/!* 7: Notes *!/*/}
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
                  </div>
                }

            </div>
        </MainLayout>
    );
}


export default AddEPCData;
