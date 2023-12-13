import {useEffect, useState} from "react";
import ProjectFinderWithResults from "@pages/Project/ProjectFinderWithResults.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form.tsx";
import {
    allElevations,
    allLocations,
    allProducts,
    ProjectCORdata,
    allCategories
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
import {MdFileUpload} from "react-icons/md";
import {Textarea} from "@components/ui/textarea.tsx";

// 1. Form schema
const FormSchema = z.object({
    // product: z.string().optional(),
    // elevation: z.string().optional(),
    // product: z.object({id: z.string(), label: z.string()}).optional(),
    // elevation: z.object({id: z.string(), label: z.string()}).optional(),

    // product: z.object({id: z.string(), label: z.string()}),
    // elevation: z.object({id: z.string(), label: z.string()}),

    product: z.string(),
    elevation: z.string(),
    // locations: z.array(z.string()).nonempty(),
    // categories: z.array(z.string()).nonempty(),
    locations: z.array(z.string()),
    categories: z.array(z.string()),
    notes: z.string()
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
            product: undefined,
            elevation: undefined,
            locations: [],
            categories: [],
            notes: ""
        }
    })


    // effect when a new project is chosen
    useEffect(() => {
        // fetch the cor_data from server
        // console.log("running useEffect to fetch cor_data for", chosenProject);

        const fetchCORData = async () => {
            const res = await axios.get(BASE_URL + `/department/teclab/cor/${chosenProject?.project_uid}`)
            // const res = await axios.get(BASE_URL + '/department/teclab/cor/826a5f29-ab9f-4d44-aa84-5659ffe9b948')
            console.log("res::=", res);

            form.setValue('product', res.data.product);
            form.setValue('elevation', res.data.elevation);
            form.setValue('locations', res.data.locations);
            form.setValue('categories', res.data.categories);
            form.setValue('notes', res.data.custom_notes);
        }
        if (chosenProject) {
            fetchCORData().then(() => {
            });
        }
    }, [chosenProject])

    // 3. Define the form submission
    function handleFormSubmit(data: z.infer<typeof FormSchema>) {
        // console.log("form-data :: ", data);

        function updateCORdata() {
            // create the body of  post request
            if (chosenProject) {
                let projectCORdata: ProjectCORdata = {
                    project_id: chosenProject.project_id,
                    project_uid: chosenProject.project_uid,
                    cor_data: {
                        // product: data.product.id,
                        // elevation: data.elevation.id,
                        product: data.product,
                        elevation: data.elevation,
                        locations: data.locations,
                        categories: data.categories,
                        custom_notes: data.notes
                    }
                };
                // console.log("projectCORdata ::", projectCORdata);

                // make a POST request
                // const resp = axios.post(BASE_URL + '/department/teclab/cor/${chosenProject?.project_uid}', projectCORdata);
                const resp = axios.post(BASE_URL + '/department/teclab/cor/', projectCORdata);
                console.log("resp ==::", resp);
            }
        }
        updateCORdata();
    }

    return (
        <>
            {/*<p className="font-medium text-2xl text-center m-4">C.O.R. Dashboard (CORD)</p>*/}
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
                                  {allProducts.map((item) => (
                                      <CommandItem key={item.id}>
                                          <FormField
                                              name="product"
                                              control={form.control}
                                              render={({field}) => (
                                                  <FormItem
                                                      className="flex flex-row items-center space-x-2 space-y-0">
                                                      <FormControl>
                                                          <Checkbox
                                                              className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                              // checked={field.value?.id === item.id}
                                                              checked={field.value === item.id}
                                                              onCheckedChange={(checked) => {
                                                                  return checked ? field.onChange(item.id) : field.onChange(undefined)
                                                                  // return checked ? field.onChange(item) : field.onChange(undefined)
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
                                  {allElevations.map((item) => (
                                      <CommandItem key={item.id}>
                                          <FormField
                                              name="elevation"
                                              control={form.control}
                                              render={({field}) => (
                                                  <FormItem
                                                      className="flex flex-row items-center space-x-2 space-y-0">
                                                      <FormControl>
                                                          <Checkbox
                                                              className="bg-default-bg1 rounded w-5 h-5 border-b1"
                                                              // checked={field.value?.id === item.id}
                                                              checked={field.value === item.id}
                                                              onCheckedChange={(checked) => {
                                                                  // return checked ? field.onChange(item) : field.onChange(undefined);
                                                                  return checked ? field.onChange(item.id) : field.onChange(undefined);
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
                                      onClick={() => form.setValue('locations', allLocations.map(item => item.id))}
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
                        <div className="w-2/3 px-6 mt-4">
                          <FormField name="notes"
                                     render={({field}) => (
                                         <FormItem>
                                             <FormLabel>
                                                 <p className="text-lg text-center font-semibold">Notes</p>
                                             </FormLabel>
                                             <FormControl>
                                                 <Textarea {...field} />
                                             </FormControl>
                                         </FormItem>
                                     )}
                          />
                        </div>
                        <Button variant="primary" className="text-md m-4 w-40" type="submit">
                          <MdFileUpload/>
                          <p className="pl-2">Update</p>
                        </Button>
                      </form>
                    </Form>
                  </div>
                }

            </div>
        </>
    );
};

export default CORUpdateForm;
