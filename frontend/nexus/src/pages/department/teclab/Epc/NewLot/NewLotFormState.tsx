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


function toggle_lot_status_finished() {
}

