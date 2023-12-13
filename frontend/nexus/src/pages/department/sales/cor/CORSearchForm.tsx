import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card.tsx";
import {allElevations, allLocations, allProducts, allCategories} from "@pages/department/sales/cor/index.ts";

import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "@components/ui/checkbox.tsx";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@components/ui/command.tsx";
import {IoMdDoneAll} from "react-icons/io";
import {TfiLayoutSidebarNone} from "react-icons/tfi";
import {FaSearch} from "react-icons/fa";
import {useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {BASE_URL} from "@/services/api";


// 1. Form schema
const FormSchema = z.object({
    products: z.array(z.string()),
    elevations: z.array(z.string()),
    locations: z.array(z.string()),
    categories: z.array(z.string())
})


const CORSearchForm = () => {

    // 2. Define the form
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            products: [],
            elevations: [],
            locations: [],
            categories: []
        }
    })

    interface IResult {
        project_info: {
            project_uid: string;
            project_id: string;
            community: string;
            section: string;
            lot_number: string;
        }
        cor_data: {
            product: string;
            elevation: string;
            locations: string[];
            categories: string[];
            custom_notes: string;

        }
    }

    const axios = useAxiosPrivate();
    const [results, setResults] = useState<IResult[] | undefined>(undefined);

    console.log("results=", results);

    // 3. Define the form submission
    function handleFormSubmit(data: z.infer<typeof FormSchema>) {
        console.log("data :: ", data);
        const searchOnServer = async () => {
            const res = await axios.post(BASE_URL + "/department/teclab/cor/find", data)
            console.log("res==", res);
            setResults(res.data);
        }
        searchOnServer().then(() => {
        })
    }

    return (
        <>
            {/*<p className="font-medium text-2xl text-center m-4">C.O.R. Dashboard (CORD)</p>*/}
            <div className="rounded-md bg-default-bg2 m-4 p-8">
                <div className="relative border border-b0 rounded-md m-8">
                    <p className="pb-3 font-semibold text-2xl text-center absolute -top-4 left-0 right-0 ml-auto mr-auto w-fit bg-default-bg2 px-4">Search
                        For Project</p>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center m-8">
                            <div className="flex items-start">
                                <div className="mx-4">
                                    <p className="text-lg text-center font-semibold">Select Products</p>
                                    <div className="flex justify-center m-2">
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('products', allProducts.map(p => p.id))}
                                        >
                                            <IoMdDoneAll/>
                                            &nbsp;Select all
                                        </button>
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('products', [])}
                                        >
                                            <TfiLayoutSidebarNone/>
                                            &nbsp;Clear
                                        </button>
                                    </div>
                                    <Command className="rounded-lg border bg-default-bg2">
                                        <CommandInput placeholder="search..."/>
                                        <CommandList>
                                            <CommandEmpty>No matches found</CommandEmpty>
                                            {allProducts.map((item) => (
                                                <CommandItem key={item.id}>
                                                    <FormField
                                                        name="products"
                                                        control={form.control}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="flex flex-row items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter((value) => value !== item.id)
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className="cursor-pointer">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </div>
                                <div className="mx-4">
                                    <p className="text-lg text-center font-semibold">Select Elevations</p>
                                    <div className="flex justify-center m-2">
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('elevations', allElevations.map(p => p.id))}
                                        >
                                            <IoMdDoneAll/>
                                            &nbsp;Select all
                                        </button>
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('elevations', [])}
                                        >
                                            <TfiLayoutSidebarNone/>
                                            &nbsp;Clear
                                        </button>
                                    </div>
                                    <Command className="rounded-lg border bg-default-bg2">
                                        <CommandInput placeholder="search..."/>
                                        <CommandList>
                                            <CommandEmpty>No matches found</CommandEmpty>
                                            {allElevations.map((item) => (
                                                <CommandItem key={item.id}>
                                                    <FormField
                                                        name="elevations"
                                                        control={form.control}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="flex flex-row items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter((value) => value !== item.id)
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className="cursor-pointer">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </div>
                                <div className="mx-4">
                                    <p className="text-lg text-center font-semibold">Select Locations</p>
                                    <div className="flex justify-center m-2">
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('locations', allLocations.map(p => p.id))}
                                        >
                                            <IoMdDoneAll/>
                                            &nbsp;Select all
                                        </button>
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('locations', [])}
                                        >
                                            <TfiLayoutSidebarNone/>
                                            &nbsp;Clear
                                        </button>
                                    </div>
                                    <Command className="rounded-lg border bg-default-bg2">
                                        <CommandInput placeholder="search..."/>
                                        <CommandList>
                                            <CommandEmpty>No matches found</CommandEmpty>
                                            {allLocations.map((item) => (
                                                <CommandItem key={item.id}>
                                                    <FormField
                                                        name="locations"
                                                        control={form.control}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="flex flex-row items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter((value) => value !== item.id)
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className="cursor-pointer">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </div>
                                <div className="mx-4">
                                    <p className="text-lg text-center font-semibold">Select Categories</p>
                                    <div className="flex justify-center m-2">
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('categories', allCategories.map(p => p.id))}
                                        >
                                            <IoMdDoneAll/>
                                            &nbsp;Select all
                                        </button>
                                        <button type="button"
                                                className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                                onClick={() => form.setValue('categories', [])}
                                        >
                                            <TfiLayoutSidebarNone/>
                                            &nbsp;Clear
                                        </button>
                                    </div>
                                    <Command className="rounded-lg border bg-default-bg2">
                                        <CommandInput placeholder="search..."/>
                                        <CommandList>
                                            <CommandEmpty>No matches found</CommandEmpty>
                                            {allCategories.map((item) => (
                                                <CommandItem key={item.id}>
                                                    <FormField
                                                        name="categories"
                                                        control={form.control}
                                                        render={({field}) => (
                                                            <FormItem
                                                                className="flex flex-row items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                                        checked={field.value?.includes(item.id)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked ? field.onChange([...field.value, item.id])
                                                                                : field.onChange(
                                                                                    field.value?.filter((value) => value !== item.id)
                                                                                )
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel
                                                                    className="cursor-pointer">{item.label}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandList>
                                    </Command>
                                </div>
                            </div>
                            <Button variant="primary" className="w-40 m-4" type="submit">
                                <FaSearch/>
                                <p className="pl-2">Search</p>
                            </Button>
                        </form>
                    </Form>
                </div>


                {results &&
                  <div className="relative border rounded-md m-8">
                    <p
                      className="pb-3 font-semibold text-2xl text-center absolute -top-4 left-0 right-0 ml-auto mr-auto w-fit bg-default-bg2 px-4">Results</p>
                    <div className="results-container flex m-8">
                        {results.map(project => (
                            <Card className="w-[350px] mx-2">
                                <CardHeader>
                                    {/*<CardTitle className="text-center">RB-05-31</CardTitle>*/}
                                    <CardTitle className="text-center">{project.project_info.project_id}</CardTitle>
                                    <CardDescription>
                                        {project.cor_data.custom_notes ? project.cor_data.custom_notes : <p>&nbsp;</p>}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Product:</p>
                                        <p className="px-2">{allProducts.find(p => p.id === project.cor_data.product)?.label}</p>
                                    </div>
                                    <div className="flex items-center">
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">Elevation:</p>
                                        <p className="px-2">{allElevations.find(e => e.id === project.cor_data.elevation)?.label}</p>
                                    </div>
                                    <div className="text-sm text-zinc-500 flex">
                                        <p>Locations:</p>
                                        <div className="flex overflow-auto">
                                            {project.cor_data.locations.map(l => (
                                                <p className="px-1 font-semibold">{l},</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-sm text-zinc-500 flex">
                                        <p>Categories:</p>
                                        <div className="flex overflow-auto">
                                            {project.cor_data.categories.map(c => (
                                                <p className="px-1 font-semibold">{c},</p>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" className="w-[100px]">Files</Button>
                                    <Button variant="outline" className="w-[100px]">Images</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                  </div>
                }

            </div>
        </>
    );
};

export default CORSearchForm;
