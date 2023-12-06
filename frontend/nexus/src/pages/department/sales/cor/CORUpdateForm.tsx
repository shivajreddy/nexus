import React, {useEffect, useState} from "react";
import ProjectFinderWithResults from "@pages/Project/ProjectFinderWithResults.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form.tsx";
import {
    elevations,
    locationCategories,
    products,
    ProjectCORdata,
    typeCategories
} from "@pages/department/sales/cor/index.ts";
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
import updates from "@pages/Updates/Updates.tsx";
import {MdFileUpload} from "react-icons/md";
import {Textarea} from "@components/ui/textarea.tsx";

// 1. Form schema
const FormSchema = z.object({
    // products: z.array(z.string()).nonempty(),
    // elevations: z.array(z.string()).nonempty(),
    products: z.string(),
    elevations: z.string(),
    locations: z.array(z.string()).nonempty(),
    categories: z.array(z.string()).nonempty()
})


const CORUpdateForm = () => {

    const [searchStatus, setSearchStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [searchResults, setSearchResults] = useState<ResultProject[]>([]);
    const [chosenProject, setChosenProject] = useState<ResultProject | undefined>(undefined);

    const axios = useAxiosPrivate();

    // 2. Define the form
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            products: undefined,
            elevations: undefined,
            locations: [],
            categories: []
        }
    })


    // effect when a new project is chosen
    useEffect(() => {
        // fetch the cor_data from server
        console.log("running useEffect to fetch cor_data for", chosenProject);

        const fetchCORData = async () => {
            const res = await axios.get(BASE_URL + `/department/teclab/cor/${chosenProject?.project_uid}`)
            console.log("res=", res);

            form.setValue('products', 'wtf')
            form.setValue('elevations', 'wtf')
            form.setValue('locations', ['wtf'])
            form.setValue('categories', ['wtf'])
        }
        if (chosenProject) {
            fetchCORData().then(() => {
            });
        }
    }, [chosenProject])

    // 3. Define the form submission
    function handleFormSubmit(data: z.infer<typeof FormSchema>) {
        console.log("form-data = ", data);

        function updateCORdata() {

            // create the body of  post request
            if (chosenProject) {
                let p: ProjectCORdata = {
                    project_id: chosenProject.project_id,
                    project_uid: chosenProject.project_uid,
                    cor_data: {
                        product: "your_product",
                        elevation: "your_elevation",
                        locations: ["location1", "location2"],
                        categories: ["category1", "category2"]
                    }
                };
                console.log("p=", p);
            }


            // make a POST request
            // axios.post(BASE_URL + '/department/teclab/cor/${chosenProject?.project_uid}')
        }

        updateCORdata();

    }

    return (
        <>
            <p className="font-medium text-2xl text-center m-4">C.O.R. Dashboard (CORD)</p>
            <div className="border border-b0 m-4 rounded-md bg-default-bg2">

                <div className="m-8">
                    <ProjectFinderWithResults
                        searchStatus={searchStatus}
                        setSearchStatus={setSearchStatus}
                        searchResults={searchResults}
                        setSearchResults={setSearchResults}
                        setChosenProject={setChosenProject}
                    />
                </div>

                {chosenProject &&
                  <div className="border rounded-md my-12 mx-8 relative">
                    <div
                      className="flex justify-center absolute -top-4 left-0 right-0 ml-auto mr-auto w-fit bg-default-bg2 px-4">
                      <p className="font-semibold text-2xl text-center">C.O.R Data</p>
                        {chosenProject &&
                          <p
                            className="font-semibold text-2xl text-center text-primary">&nbsp;:&nbsp;{chosenProject.project_id}</p>
                        }
                    </div>

                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col items-center pt-8">
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
                                      onClick={() => form.setValue('categories', typeCategories.map(p => p.id))}
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
                        <div className="w-2/3 px-6 mt-4">
                          <p className="text-lg text-center font-semibold">Notes</p>
                          <Textarea/>
                        </div>
                        <div className="flex space-x-4">
                          <Button variant="primary" className="text-md m-4 w-40">
                            <MdFileUpload/>
                            <p className="pl-2">Update</p>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                }

            </div>
        </>
    );
};

export default CORUpdateForm;
