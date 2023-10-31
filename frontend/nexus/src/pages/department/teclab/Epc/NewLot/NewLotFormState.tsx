// + This should align with FastAPI modal schema
type EPCData = {
    // status
    lot_status_finished: boolean;
    lot_status_released: boolean;

    // lot-info
    community?: string;
    section_number?: string;
    lot_number?: string;
    contract_date?: string;
    contract_type?: string;
    product_name?: string;
    elevation_name?: string;

    // Drafting
    drafting_drafter?: string;
    drafting_assigned_on?: string;
    drafting_finished?: string;

    // Engineering
    engineering_engineer?: string;
    engineering_sent?: string;
    engineering_received?: string;

    // Plat
    plat_engineer?: string;
    plat_sent?: string;
    plat_received?: string;

    // Permitting
    permitting_county_name?: string;
    permitting_submitted?: string;
    permitting_received?: string;

    // BBP
    bbp_posted?: string;

    // Notes
    notes?: string;
}


export {
    type EPCData,
}
