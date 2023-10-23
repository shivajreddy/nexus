// + This should align with FastAPI modal schema

type INewLotData = {
    // Lot-info
    contract_type: string,
    lot_status_finished: boolean,
    lot_status_released: boolean,
    contract_date?: Date,
    community_name: string;
    section_number: string;
    lot_number: string;
    product_name: string;
    elevation_name: string;

    // Drafting
    drafting_drafter: string;
    drafting_dread_line?: Date;
    drafting_finished?: Date;

    // Engineering
    engineering_engineer: string;
    engineering_sent?: Date;
    engineering_expected?: Date;
    engineering_received?: Date;

    // Plat
    plat_engineer: string;
    plat_sent?: Date;
    plat_expected?: Date;
    plat_received?: Date;

    //Permitting
    permitting_county_name: string;
    permitting_expected_submit?: Date;
    permitting_submitted?: Date;
    permitting_received?: Date;

    // Build By Plans
    bbp_expected_post?: Date;
    bbp_posted?: Date;

    // Notes
    notes?: string;
}


export {
    type INewLotData,
}
