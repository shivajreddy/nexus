import {Button} from "@components/ui/button.tsx";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@components/ui/card.tsx";
import {elevations, locationCategories, products, typeCategories} from "@pages/department/sales/cor/index.ts";

import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Checkbox} from "@components/ui/checkbox.tsx";
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList} from "@components/ui/command.tsx";
import {IoMdDoneAll} from "react-icons/io";
import {TfiLayoutSidebarNone} from "react-icons/tfi";


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

    // 3. Define the form submission
    function handleFormSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    return (
        <div className="border border-b0 m-4 rounded-xl bg-default-bg2">
            <div className="flex items-center justify-center bg-default-bg2 p-2 rounded-t-md border-b">
                <p className="font-medium text-2xl text-center">C.O.R. Dashboard (CORD)</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center m-4">
                    <div className="flex items-start">
                        <div className="mx-4">
                            <p className="text-lg text-center font-semibold">Select Products</p>
                            <div className="flex justify-center m-2">
                                <button type="button"
                                        className="flex justify-center items-center border rounded-lg mx-1 px-2 text-sm font-semibold"
                                        onClick={() => form.setValue('products', products.map(p => p.id))}
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
                                        onClick={() => form.setValue('elevations', elevations.map(p => p.id))}
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
                    <Button variant="primary" className="text-md m-4">Search</Button>
                </form>
            </Form>

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

export default CORSearchForm;
