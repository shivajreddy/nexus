// + This should align with FastAPI modal schema

type TECLabFOSCData = {
    // project-info
    project_uid: string;
    project_id: string;

    // lot-info
    community?: string;
    section_number?: string;
    lot_number?: string;

    // status
    lot_status_started?: boolean;
    lot_status_finished?: boolean;

    // Supervisors
    assigned_pm?: string;
    assigned_director?: string;

    // Foundation
    foundation_scan_status?: boolean;
    foundation_scanner?: string;
    foundation_scan_date?: Date;
    foundation_report_status?: boolean;
    foundation_reporter?: string;
    foundation_report_date?: Date;
    foundation_uploaded?: boolean;

    // Slab
    slab_scan_status?: boolean;
    slab_scanner?: string;
    slab_scan_date?: Date;
    slab_report_status?: boolean;
    slab_reporter?: string;
    slab_report_date?: Date;
    slab_uploaded?: boolean;

    // Frame
    frame_scan_status?: boolean;
    frame_scanner?: string;
    frame_scan_date?: Date;
    frame_report_status?: boolean;
    frame_reporter?: string;
    frame_report_date?: Date;
    frame_uploaded?: boolean;

    // MEP
    mep_scan_status?: boolean;
    mep_scanner?: string;
    mep_scan_date?: Date;
    mep_report_status?: boolean;
    mep_reporter?: string;
    mep_report_date?: Date;
    mep_uploaded?: boolean;

    // Misc (warranty, extra)
    misc_scan_status?: boolean;
    misc_report_status?: boolean;
    foundation_needed?: boolean;
    slab_needed?: boolean;
    frame_needed?: boolean;
    mep_needed?: boolean;

    // Notes
    notes?: string;

}
export {
    type TECLabFOSCData,
}
