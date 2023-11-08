import {CheckboxReactHookFormMultiple} from "@pages/testing/CheckboxReactHookFormMultiple.tsx";
import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card.tsx";
import {cn} from "@/lib/utils.ts";
import * as React from "react";

const MyComponent = () => {

    // const [products, setProducts] = useState<string[]>([]);
    const products = [
        {id: "cardinal", label: "Cardinal"},
        {id: "gayandneel", label: "Gay and Neel"},
        {id: "hassel", label: "Hassel"},
        {id: "koontz", label: "Koontz"},
        {id: "parkerdesign", label: "Parker Design"},
        {id: "eda", label: "EDA"},
        {id: "aes", label: "AES"},
        {id: "townes", label: "Townes"},
        {id: "balzer", label: "Balzer"},
        {id: "baydesign", label: "Bay Design"}
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
                <CheckboxReactHookFormMultiple
                    data={products}
                    formLabel="1. Choose the list of products"
                    formDescription="Choosing none will search in all products"
                />
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

