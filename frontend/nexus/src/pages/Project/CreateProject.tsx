import React, {useEffect, useState} from "react";
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
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Button} from "@components/ui/button.tsx";
import {AxiosError} from "axios";

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

    interface ServerResponse {
        result: string;
        new_project_id: string; // Assuming new_project_id is a string, you can adjust the type accordingly
        community_code: string;
        section_number: string;
        lot_number: string;
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
            console.log("response for /projects/new: ", response.data);
            setResult(response.data);
            setStatus("initial");
        } catch (e: any) {
            console.log("Error:", e);
            if (e.response.status === 409) {
                console.log("DUP:", e.response.data.detail)
                setStatus('initial');
                return;
            }
            setStatus("failed");
        }
    }

    return (
        <div className="px-10 p-5 bg-default-bg2 rounded-lg my-4">
            <p className="px-4 font-semibold text-2xl">Create Project</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">

                    <FormField
                        control={form.control}
                        name="community"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="flex items-center">
                                    Community
                                    <FormMessage className="px-2"/>
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a community"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {existingCommunities.map(community => <SelectItem key={community}
                                                                                          value={community}>{community}</SelectItem>)}
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
                                <FormLabel className="flex items-center">Section
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
                                <FormLabel className="flex items-center">
                                    Lot Number
                                    <FormMessage className="px-2"/>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
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
            <div>
                {result &&
                  <div>
                    <p className="text-primary font-semibold my-4">New Project Created, with project-id </p>
                    <div className="flex px-2">
                      <p className="h-max px-2 border rounded-lg">{result.community_code}</p>
                      <p className="h-max mx-2 px-2 border rounded-lg">{result.section_number}</p>
                      <p className="h-max px-2 border rounded-lg">{result.lot_number}</p>
                    </div>
                  </div>
                }
            </div>

        </div>
    );
};

export default CreateProject;
