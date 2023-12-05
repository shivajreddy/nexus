
interface CORdata {
    product: string;
    elevation: string;
    locations: string[];
    type_categories: string[];
}

interface ProjectCORdata{
    project_id: string;
    project_uid: string;
    cor_data: CORdata;
}

export type {CORdata, ProjectCORdata};
