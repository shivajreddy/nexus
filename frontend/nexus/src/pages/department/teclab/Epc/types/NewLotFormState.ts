// + This should align with FastAPI modal schema
// import { stringify } from "uuid/index";

type TECLabEPCData = {
    // project-info
    project_uid: string;
    project_id: string;

    // status
    lot_status_finished?: boolean;
    lot_status_released?: boolean;

    // lot-info
    community?: string;
    section_number?: string;
    lot_number?: string;

    // Contract details
    contract_date?: Date;
    contract_type?: string;
    product_name?: string;
    elevation_name?: string;

    // Drafting
    drafting_drafter?: string;
    drafting_assigned_on?: Date;
    drafting_finished?: Date;
    drafting_notes?: string;

    // Engineering
    engineering_engineer?: string;
    engineering_sent?: Date;
    engineering_received?: Date;
    engineering_notes?: string;

    // Plat
    plat_engineer?: string;
    plat_sent?: Date;
    plat_received?: Date;
    plat_notes?: string;

    // Permitting
    permitting_county_name?: string;
    permitting_submitted?: Date;
    permitting_received?: Date;
    permitting_notes?: string;
    permithold_start?: Date;

    // Homesiting
    homesiting_requested_on?: Date;
    homesiting_completed_by?: string;
    homesiting_completed_on?: Date;
    homesiting_feedback_received_date?: Date;
    homesiting_notes?: string;

    // BBP
    bbp_posted?: Date;

    // BOC related
    proposed_BOC?: string;
    as_built_BOC?: string;
    variance_BOC?: string;
    field_feedback_notes?: string;

    // Notes
    notes?: string;


    // // status
    // lot_status_finished: boolean;
    // lot_status_released: boolean;
    //
    // // lot-info
    // community?: string;
    // section_number?: string;
    // lot_number?: string;
    // contract_date?: string;
    // contract_type?: string;
    // product_name?: string;
    // elevation_name?: string;
    //
    // // Drafting
    // drafting_drafter?: string;
    // drafting_assigned_on?: string;
    // drafting_finished?: string;
    //
    // // Engineering
    // engineering_engineer?: string;
    // engineering_sent?: string;
    // engineering_received?: string;
    //
    // // Plat
    // plat_engineer?: string;
    // plat_sent?: string;
    // plat_received?: string;
    //
    // // Permitting
    // permitting_county_name?: string;
    // permitting_submitted?: string;
    // permitting_received?: string;
    //
    // // BBP
    // bbp_posted?: string;
    //
    // // Notes
    // notes?: string;

}
export {
    type TECLabEPCData,
}
