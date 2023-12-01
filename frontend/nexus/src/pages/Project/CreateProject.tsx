import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {useForm} from "react-hook-form";

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

import {
    Select,
    SelectContent, SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@components/ui/button.tsx";

const formSchema = z.object({
    community: z.string().min(1, {message: "( Required )"}),
    section: z.string().min(1, {message: "( Required )"}),
    lot_number: z.string().min(1, {message: "( Required )"})
})


const CreateProject = () => {
    const axios = useAxiosPrivate();
    const [existingCommunities, setExistingCommunities] = useState<string[]>([]);

    // + Fetch communities data from server
    useEffect(() => {
        async function getData() {
            const communitiesResponse = await axios.get('/eagle/communities');
            setExistingCommunities(communitiesResponse.data);
        }

        getData().then(() => {
        });
    }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            community: "",
            section: "",
            lot_number: ""
        },
    })

    const [status, setStatus] = useState<"initial" | "loading" | "failed">("initial");
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);

    interface ServerResponse {
        result: string;
        new_project: {
            contract_info: {},
            meta_info: {},
            project_info: {
                project_id: string;
                project_uid: string;
            }
        }
    }

    const [result, setResult] = useState<ServerResponse>();


    async function onSubmit(values: z.infer<typeof formSchema>) {
        setStatus("loading")
        try {
            const response = await axios.post('/projects/new',
                {
                    "community": values.community,
                    "section": values.section,
                    "lot_number": values.lot_number
                },
                {headers: {"Content-Type": "application/json"}}
            )
            // console.log("response for /projects/new: ", response.data);
            setResult(response.data);
            setStatus("initial");
            setErrorMsg(undefined);
        } catch (e: any) {
            console.log("Error:", e);
            if (e.response.status === 409) {
                console.log("DUP:", e.response.data.detail)
                setErrorMsg(e.response.data.detail);
                setStatus('initial');
                setResult(undefined);
                return;
            }
            setStatus("failed");
        }
    }

    return (
        <div className="m-4 p-4 bg-default-bg2 rounded-lg my-4">
            <p className="font-semibold text-2xl pb-4">Create Project</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                    <div className="flex space-x-4">
                        <FormField
                            control={form.control}
                            name="community"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="flex items-center select-none">
                                        Community
                                        <FormMessage className="px-2"/>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="min-w-[20em]">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a community"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup className="max-h-40 overflow-y-scroll">
                                                {existingCommunities.map(community => <SelectItem key={community}
                                                                                                  value={community}>{community}</SelectItem>)}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="section"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="flex items-center select-none">Section
                                        <FormMessage className="px-2"/>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lot_number"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="flex items-center select-none">
                                        Lot Number
                                        <p className="px-2 text-default-fg1">(Note: 1 and 01 are not same)</p>
                                        <FormMessage className="px-2"/>
                                    </FormLabel>
                                    <FormControl>
                                        <Input placeholder="" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {status === 'initial' &&
                      <Button type="submit" variant="primary">
                        Create
                      </Button>
                    }
                    {status === 'loading' &&
                      <button disabled
                              type="submit"
                              className="cursor-not-allowed flex items-center p-2 rounded-md bg-default-fg1 text-default-bg2">
                        Please wait
                      </button>
                    }
                    {status === 'failed' &&
                      <Button type="submit" variant="primary">
                        Failed to fetch
                      </Button>
                    }
                </form>
            </Form>

            {result &&
              <div className="border-2 border-green-500 my-2 py-2 rounded-md bg-default-bg1">
                <div className="flex px-4">
                  <p className="font-semibold text-green-500">SUCCESS: &nbsp;</p>
                  <p className="h-max px-2 border rounded-lg">
                      {result.new_project.project_info.project_id}
                  </p>
                  <p>&nbsp; is created</p>
                </div>
              </div>
            }

            {errorMsg &&
              <div className="border-2 border-red-500 my-2 py-2 rounded-md bg-default-bg1">
                <div className="flex px-4">
                  <p className="font-semibold text-destructive">ERROR: &nbsp;</p>
                  <p className="h-max px-2 border rounded-lg">
                      {form.getValues().community}-{form.getValues().section}-{form.getValues().lot_number}
                  </p>
                  <p>&nbsp; already exists</p>
                </div>
              </div>
            }

        </div>
    );
};

export default CreateProject;
