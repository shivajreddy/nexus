const allProducts = [
    {id: "acton", label: "Acton"},
    {id: "belmont", label: "Belmont"},
    {id: "belmont_terrace", label: "Belmont Terrace"},
    {id: "beverly", label: "Beverly"},
    {id: "bradford", label: "Bradford"},
    {id: "carlisle", label: "Carlisle"},
    {id: "caroline", label: "Caroline"},
    {id: "corvallis", label: "Corvallis"},
    {id: "easton", label: "Easton"},
    {id: "fulton", label: "Fulton"},
    {id: "fulton_terrace", label: "Fulton Terrace"},
    {id: "grayson", label: "Grayson"},
    {id: "hadley", label: "Hadley"},
    {id: "hartford_ii", label: "Hartford II"},
    {id: "hartford_terrace", label: "Hartford Terrace"},
    {id: "hawthorne", label: "Hawthorne"},
    {id: "helena", label: "Helena"},
    {id: "laurel", label: "Laurel"},
    {id: "linden_iii", label: "Linden III"},
    {id: "linden_terrace", label: "Linden Terrace"},
    {id: "malvern", label: "Malvern"},
    {id: "manchester", label: "Manchester"},
    {id: "manchester_duplex", label: "Manchester Duplex"},
    {id: "newport", label: "Newport"},
    {id: "park", label: "Park"},
    {id: "raleigh", label: "Raleigh"},
    {id: "rowland", label: "Rowland"},
    {id: "savannah", label: "Savannah"},
    {id: "stamford", label: "Stamford"},
    {id: "wellington_ii", label: "Wellington II"},
    {id: "westfield", label: "Westfield"},
    {id: "westminster", label: "Westminster"},
    {id: "cedar", label: "Cedar"},
    {id: "azalea", label: "Azalea"},
    {id: "magnolia", label: "Magnolia"},
    {id: "cason", label: "Cason"},
    {id: "longleaf", label: "Longleaf"},
    {id: "linden_iv", label: "Linden IV"},
    {id: "bellavue", label: "Bellavue"},
    {id: "clarion", label: "Clarion"},
    {id: "none", label: "NONE"},
    {id: "westmoreland", label: "Westmoreland"},
    {id: "boulevard", label: "Boulevard"},
    {id: "arlington", label: "Arlington"},
    {id: "mckinney", label: "McKinney"},
    {id: "bhc_18g", label: "BHC 18G"},
    {id: "bhc_18h", label: "BHC 18H"},
    {id: "bhc_22c", label: "BHC 22C"},
    {id: "bhc_22e", label: "BHC 22E"},
    {id: "bhc_22f", label: "BHC 22F"},
    {id: "braddock", label: "Braddock"},
    {id: "custom", label: "CUSTOM"},
    {id: "old_oyster_retreat", label: "Old Oyster Retreat"},
    {id: "the_palmetto", label: "The Palmetto"},
    {id: "davidson", label: "Davidson"},
    {id: "dianes_farmhouse", label: "Diane's Farmhouse"},
    {id: "bhc_22b", label: "BHC 22B"},
    {id: "bhc_22d", label: "BHC 22D"},
    {id: "bhc_22g", label: "BHC 22G"},
    {id: "brookline", label: "Brookline"},
    {id: "millcreek", label: "Millcreek"},
    {id: "highland", label: "Highland"},
];

const allLocations = [
    {id: "primarybath", label: "Primary Bath"},
    {id: "secondarybath", label: "Secondary Bath"},
    {id: "newbath", label: "New Bath"},
    {id: "kitchen", label: "Kitchen"},
    {id: "primarybedroom", label: "Primary Bedroom"},
    {id: "secondarybedroom", label: "Secondary Bedroom"},
    {id: "patio", label: "Patio"},
    {id: "fireplace", label: "Fireplace"}
];

const allElevations = [
    {id: "10traditional", label: "10 - Traditional"},
    {id: "15artsandcrafts", label: "15 - Arts & Crafts"},
    {id: "20artsandcrafts", label: "20 - Arts & Crafts"},
    {id: "20colonial", label: "20 - Colonial"},
    {id: "20craftsman", label: "20 - Craftsman"},
    {id: "25folkvictorian", label: "25 - Folk Victorian"},
    {id: "30artsandcrafts", label: "30 - Arts & Crafts"},
    {id: "30craftsman", label: "30 - Craftsman"},
    {id: "35cottage", label: "35 - Cottage"},
    {id: "40artsandcraftsb", label: "40 - Arts & Crafts B"},
    {id: "40european", label: "40 - European"},
    {id: "40folkvictorian", label: "40 - Folk Victorian"},
    {id: "40newengland", label: "40 - New England"},
    {id: "60farmhouse", label: "60 - Farmhouse"},
    {id: "acolonial", label: "A - Colonial"},
    {id: "aeuropean", label: "A - European"},
    {id: "afolkvictorian", label: "A - Folk Victorian"},
    {id: "artsandcrafts", label: "Arts & Crafts"},
    {id: "artsandcraftsb", label: "Arts & Crafts B"},
    {id: "bcraftsman", label: "B - Craftsman"},
    {id: "bfolkvictorian", label: "B - Folk Victorian"},
    {id: "bseartsandcrafts", label: "BSE - Arts & Crafts"},
    {id: "coastal", label: "Coastal"},
    {id: "colonial", label: "Colonial"},
    {id: "cottage", label: "Cottage"},
    {id: "craftsman", label: "Craftsman"},
    {id: "folkvictorian", label: "Folk Victorian"},
    {id: "gea2r", label: "GE - A - 2 - R"},
    {id: "grc1f", label: "GR - C - 1 - F"},
    {id: "grd2r", label: "GR - D - 2 - R"}
];

const allCategories = [
    {id: "windows", label: "Windows"},
    {id: "doors", label: "Doors"},
    {id: "vanity", label: "Vanity"},
    {id: "fireplace", label: "Fireplace"}
]

interface CORdata {
    product: string;
    elevation: string;
    locations: string[];
    categories: string[];
    custom_notes: string;
}

interface ProjectCORdata{
    project_id: string;
    project_uid: string;
    cor_data: CORdata;
}

export {
    allProducts,
    allLocations,
    allElevations,
    allCategories,
}
export type {CORdata, ProjectCORdata};
