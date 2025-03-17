// + This should align with FastAPI modal schema

// project-info, lot-info, home-siting-info are put into 'TECLabFOSCData' for convenience, but reset of the ppties
// must aligh with `class FOSCData(BaseModel):`
type TECLabFOSCData = {
  // project-info
  project_uid: string;
  project_id: string;

  // lot-info
  community?: string;
  section_number?: string;
  lot_number?: string;

  // home-siting-info
  homesiting_completed_by?: string;
  homesiting_completed_on?: Date;
  homesiting_requested_on?: Date;

  // status
  lot_status_started?: boolean;
  lot_status_finished?: boolean;

  // Supervisors
  assigned_pm?: string;
  assigned_director?: string;

  // Foundation
  foundation_scan_status?: boolean;
  foundation_scan_date?: Date;
  foundation_report_status?: boolean;
  foundation_reporter?: string;
  foundation_report_date?: Date;
  foundation_uploaded?: boolean;
  foundation_needed?: boolean;

  // Slab
  slab_scan_status?: boolean;
  slab_scan_date?: Date;
  slab_report_status?: boolean;
  slab_reporter?: string;
  slab_report_date?: Date;
  slab_uploaded?: boolean;
  slab_needed?: boolean;

  // Frame
  frame_scan_status?: boolean;
  frame_scan_date?: Date;
  frame_report_status?: boolean;
  frame_reporter?: string;
  frame_report_date?: Date;
  frame_uploaded?: boolean;
  frame_needed?: boolean;

  // MEP
  mep_scan_status?: boolean;
  mep_scan_date?: Date;
  mep_report_status?: boolean;
  mep_reporter?: string;
  mep_report_date?: Date;
  mep_uploaded?: boolean;
  mep_needed?: boolean;

  // Misc (warranty, extra)
  misc_scan_status?: boolean;
  misc_report_status?: boolean;

  // Notes
  notes?: string;
}

export {
  type TECLabFOSCData,
}
