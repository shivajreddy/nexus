import "@assets/pages/Epc/NewLotForm.css"
import {Textarea} from "@components/ui/textarea.tsx";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {useState} from "react";
import FieldDropDown from "@pages/department/teclab/Epc/NewLot/FieldDropDown.tsx";
import FieldText from "@pages/department/teclab/Epc/NewLot/FieldText.tsx";
import FieldDate from "@pages/department/teclab/Epc/NewLot/FieldDate.tsx";
import FieldToggle from "@pages/department/teclab/Epc/NewLot/FieldToggle.tsx";


type INewLotData = {
    // Lot-info
    lot_status_finished: false,
    lot_status_released: false,
    community_name?: "";
    section_number?: number;
    contract_date?: Date;
    product_name?: "";
    elevation_name?: string;

    // Drafting
    drafting_drafter?: "";
    drafting_dread_line?: Date;
    drafting_finished?: Date;

    // Engineering
    engineering_engineer?: string;
    engineering_sent?: Date;
    engineering_expected?: Date;
    engineering_received?: Date;

    // Plat
    plat_engineer?: string;
    plat_sent?: Date;
    plat_expected?: Date;
    plat_received?: Date;

    //Permitting
    permitting_count_name?: string;
    permitting_expected_submit?: Date;
    permitting_submitted?: Date;
    permitting_received?: Date;

    // Build By Plans
    bbp_expected_post?: Date;
    bbp_posted?: Date;

    // Notes
    notes?: string;
}


const NewLotForm = () => {

    // Form's State
    const [newLotData, setNewLotData] = useState<INewLotData>({
        // Lot-info
        lot_status_finished: false,
        lot_status_released: false,
    });

    return (
        <div id="new-lot-form-container" className="border">

            {/* 1: Lot Info */}
            <Card className="new-lot-section" id="new-lot-form-lot-info">
                <CardHeader>
                    <CardTitle>Lot Info</CardTitle>
                    <CardDescription>Lot's identity Information</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldToggle id="1_finished"
                                 name="Finished"
                                 isChecked={newLotData.lot_status_finished}
                                 updateLotData={setNewLotData}
                    />
                    <FieldToggle id="1_released"
                                 name="Released"
                                 isChecked={newLotData.lot_status_released}
                                 updateLotData={setNewLotData}
                    />
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
                </CardContent>
            </Card>

            {/* 2: Drafting */}
            <Card className="new-lot-section" id="new-lot-form-drafting">
                <CardHeader>
                    <CardTitle>Drafting</CardTitle>
                    <CardDescription>Drafter and their time information</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
                </CardContent>
            </Card>

            {/* 3: Engineering */}
            <Card className="new-lot-section" id="new-lot-form-engineering">
                <CardHeader>
                    <CardTitle>Engineering</CardTitle>
                    <CardDescription>Engineer and their time information</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
                </CardContent>
            </Card>

            {/* 4: Plat*/}
            <Card className="new-lot-section" id="new-lot-form-plat">
                <CardHeader>
                    <CardTitle>Plat Engineer</CardTitle>
                    <CardDescription>Plat-Engineer and their time information</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
                </CardContent>
            </Card>

            {/* 5: Permitting */}
            <Card className="new-lot-section" id="new-lot-form-permitting">
                <CardHeader>
                    <CardTitle>Permitting</CardTitle>
                    <CardDescription>Permitting details</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
                </CardContent>
            </Card>

            {/* 6: Build By Plans*/}
            <Card className="new-lot-section" id="new-lot-form-bbp">
                <CardHeader>
                    <CardTitle>Build By Plans</CardTitle>
                    <CardDescription>BBP details</CardDescription>
                </CardHeader>
                <CardContent>
                    <FieldDate id="1_contract_date" name="Contract Date"/>
                    <FieldText id="1_section" name={"Section"}/>
                    <FieldText id="1_lot_number" name={"Lot Number"} placeholder="write a lot #"/>
                    <FieldDropDown name={"Product"} data={["shiva", "reddy"]}/>
                    <FieldDropDown name={"Elevation"} data={["shiva", "reddy"]}/>
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
    )
};


export default NewLotForm;