import {useEffect, useState} from "react";
import useAxiosPrivate from "@hooks/useAxiosPrivate.ts";
import {useForm} from "react-hook-form";

import * as z from "zod"
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"

const formSchema = z.object({
    username: z.string().min(2).max(50),
    community: z.string().min(1, "Is required"),
    section: z.string().min(1, "Is required"),
    lot_number: z.string().min(1, "Is required")
})


const CreateProject = () => {
    const axios = useAxiosPrivate();
    const [existingCommunities, setExistingCommunities] = useState<string[]>([]);

    // + Fetch commmunities data from server
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
            username: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (
        <div className="px-10 p-5 bg-default-bg2 rounded-lg my-4">
            <p className="px-4 font-semibold text-2xl">Create Project</p>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="shadcn" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <button type="submit">Submit</button>
                </form>
            </Form>

        </div>
    );
};

export default CreateProject;
