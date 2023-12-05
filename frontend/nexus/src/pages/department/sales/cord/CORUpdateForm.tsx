import {useEffect, useState} from "react";
import ProjectFinderWithResults from "@pages/Project/ProjectFinderWithResults.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form.tsx";
import {elevations, locationCategories, products, typeCategories} from "@pages/department/sales/cord/index.ts";
import {IoMdDoneAll} from "react-icons/io";
import {TfiLayoutSidebarNone} from "react-icons/tfi";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@components/ui/command.tsx";
import {Checkbox} from "@components/ui/checkbox.tsx";
import {Button} from "@components/ui/button.tsx";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {BASE_URL} from "@/services/api";

// 1. Form schema
const FormSchema = z.object({
    products: z.array(z.string()),
    elevations: z.array(z.string()),
    location_categories: z.array(z.string()),
    type_categories: z.array(z.string())
})


const CORUpdateForm = () => {

    const [searchStatus, setSearchStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);
    const [chosenProject, setChosenProject] = useState<ResultProject | undefined>(undefined);

    // 2. Define the form
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            products: [],
            elevations: [],
            location_categories: [],
            type_categories: []
        }
    })

    const axios = useAxiosPrivate();

    useEffect(() => {
        // fetch the cor_data from server
        console.log("running useEffect to fetch cor_data for", chosenProject);

        const fetchCORData = async () => {
            const res = await axios.get(BASE_URL + `/department/teclab/cor/${chosenProject?.project_uid}`)
            console.log("res=", res);
        }
        if (chosenProject) {
            fetchCORData().then(() => {
            });
        }
    }, [chosenProject])

    // 3. Define the form submission
    function handleFormSubmit(data: z.infer<typeof FormSchema>) {
        console.log("chosen project = ", data);
    }

    return (
        <div className="border border-b0 m-4 rounded-xl bg-default-bg2">
            <div className="flex items-center justify-center bg-default-bg2 p-2 rounded-t-md border-b">
                <p className="font-medium text-2xl text-center">C.O.R. Dashboard (CORD)</p>
            </div>

            <div className="m-4 mx-8">
                <ProjectFinderWithResults
                    searchStatus={searchStatus}
                    setSearchStatus={setSearchStatus}
                    searchResults={searchResults}
                    setSearchResults={setSearchResults}
                    setChosenProject={setChosenProject}
                />
            </div>

            {chosenProject &&
              <>
                <p>Chosen: {JSON.stringify(chosenProject)}</p>
              </>
            }

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center m-4">
                    <div className="flex items-start">
                        <div className="mx-4">
                            <p className="text-lg text-center font-semibold">Select Product</p>
                            <Command className="rounded-lg border bg-default-bg2">
                                <CommandInput placeholder="search..."/>
                                <CommandList>
                                    <CommandEmpty>No matches found</CommandEmpty>
                                    {products.map((item) => (
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
                                                                    // return checked ? field.onChange([...field.value, item.id])
                                                                    return checked ? field.onChange([item.id])
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
                            <p className="text-lg text-center font-semibold">Select Elevation</p>
                            <Command className="rounded-lg border bg-default-bg2">
                                <CommandInput placeholder="search..."/>
                                <CommandList>
                                    <CommandEmpty>No matches found</CommandEmpty>
                                    {elevations.map((item) => (
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
                                                                    // return checked ? field.onChange([...field.value, item.id])
                                                                    return checked ? field.onChange([item.id])
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
                                        onClick={() => form.setValue('location_categories', locationCategories.map(p => p.id))}
                                >
                                    <IoMdDoneAll/>
                                    &nbsp;Select all
                                </button>
                                <button type="button"
                                        className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                        onClick={() => form.setValue('location_categories', [])}
                                >
                                    <TfiLayoutSidebarNone/>
                                    &nbsp;Clear
                                </button>
                            </div>
                            <Command className="rounded-lg border bg-default-bg2">
                                <CommandInput placeholder="search..."/>
                                <CommandList>
                                    <CommandEmpty>No matches found</CommandEmpty>
                                    {locationCategories.map((item) => (
                                        <CommandItem key={item.id}>
                                            <FormField
                                                name="location_categories"
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
                                        onClick={() => form.setValue('type_categories', typeCategories.map(p => p.id))}
                                >
                                    <IoMdDoneAll/>
                                    &nbsp;Select all
                                </button>
                                <button type="button"
                                        className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                        onClick={() => form.setValue('type_categories', [])}
                                >
                                    <TfiLayoutSidebarNone/>
                                    &nbsp;Clear
                                </button>
                            </div>
                            <Command className="rounded-lg border bg-default-bg2">
                                <CommandInput placeholder="search..."/>
                                <CommandList>
                                    <CommandEmpty>No matches found</CommandEmpty>
                                    {typeCategories.map((item) => (
                                        <CommandItem key={item.id}>
                                            <FormField
                                                name="type_categories"
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
                    <Button variant="primary" className="text-md m-4">Update</Button>
                </form>
            </Form>

        </div>
    );
};

export default CORUpdateForm;
