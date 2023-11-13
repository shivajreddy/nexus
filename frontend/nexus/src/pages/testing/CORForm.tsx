import {CheckboxReactHookFormMultiple} from "@pages/testing/CheckboxReactHookFormMultiple.tsx";
import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card.tsx";
import {ScrollArea} from "@components/ui/scroll-area.tsx";

const MyComponent = () => {

    // const [products, setProducts] = useState<string[]>([]);
    const products = [
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

    const locationCategories = [
        {id: "primarybath", label: "Primary Bath"},
        {id: "secondarybath", label: "Secondary Bath"},
        {id: "newbath", label: "New Bath"},
        {id: "kitchen", label: "Kitchen"},
        {id: "primarybedroom", label: "Primary Bedroom"},
        {id: "secondarybedroom", label: "Secondary Bedroom"},
        {id: "patio", label: "Patio"},
        {id: "fireplace", label: "Fireplace"}
    ];

    const elevations = [
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

    const typeCategories = [
        {id: "windows", label: "Windows"},
        {id: "doors", label: "Doors"},
        {id: "vanity", label: "Vanity"},
        {id: "fireplace", label: "Fireplace"}
    ]


    return (
        <div className="border border-b1 m-4 p-4 rounded-xl bg-default-bg1">
            <p className="font-bold text-2xl text-center">C.O.R. Dashboard (CORD)</p>
            {/*<p className="font-bold text-2xl text-center">TAKE A C.O.R - LEAVE A C.O.R</p>*/}

            <div className="selection-section">
                <p className="text-base">1. Choose the list of products</p>
                <p className="text-sm text-zinc-500">Choosing none will search in all products</p>
                {/*<ScrollArea className="h-72 w-48 rounded-md border border-b1 border-b-0">*/}
                {/*    <CheckboxReactHookFormMultiple*/}
                {/*        data={products}*/}
                {/*        formLabel=""*/}
                {/*        formDescription=""*/}
                {/*    />*/}
                {/*</ScrollArea>*/}
                <div className="h-72 2-48 rounded-md border border-b1 border-b-0 rounded-bl-none rounded-br-none">
                    <p>test selection</p>
                </div>
                <div className="flex items-center border border-red-600">
                    <div className="p-2 h-11 bg-pink-300 border border-b2 rounded-bl-md">
                        <p className="">chosen</p>
                    </div>
                    <div className="flex py-2 border border-b1 rounded-br-md items-center">
                        <div className="border border-b2 mx-2 px-2">option1</div>
                        <div className="border border-b2 mx-2 px-2">loooooooooong option1</div>
                    </div>
                </div>
            </div>

            <div className="selection-section">
                <CheckboxReactHookFormMultiple
                    data={elevations}
                    formLabel="2. Choose the list of Elevations"
                    formDescription="Choosing none will search in all products"
                />
            </div>

            <div className="selection-section">
                <CheckboxReactHookFormMultiple
                    data={locationCategories}
                    formLabel="3. Choose the Location Categories"
                    formDescription="Must choose atleast 1"
                />
            </div>

            <div className="selection-section">
                <CheckboxReactHookFormMultiple
                    data={typeCategories}
                    formLabel="4. Type Categories"
                    formDescription="Choosing none will search in all products"
                />
            </div>

            <Button>Search the Database</Button>

            <div>
                <p className="font-bold text-2xl text-center">Results (demo)</p>

                <div className="results-container flex">
                    <Card className="w-[350px]">
                        <CardHeader>
                            <CardTitle className="text-center">RB-05-31</CardTitle>
                            <CardDescription>
                                {"add niche to bedroom 2"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Product:
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Elevation:
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Location:
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Type:
                            </p>
                            <img src="path/to/your/image.jpg" alt="RB-05-31"/>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" className="w-[100px]">Files</Button>
                            <Button variant="outline" className="w-[100px]">Images</Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>


        </div>
    );
};

export default MyComponent;
