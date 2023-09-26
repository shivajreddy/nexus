import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {Button} from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React from "react";


// :: Form Schema
const formSchema = z
    .object({
        useremail: z
            .string()
            .email("Invalid email format")
            .refine(
                (value) =>
                    value.endsWith("@eagleofva.com") || value.endsWith("@tecofva.com"),
                {
                    message: "( Use @eagleofva.com or @tecofva.com )",
                }
            ),
        password: z.string().min(8, {
            message: "( Password must be at least 8 characters )",
        }),
        retypePassword: z.string(),

        department: z.string().min(1, "( Required )"),
    })
    .refine((data) => data.password === data.retypePassword, {
        message: "( Passwords must match )",
        path: ["retypePassword"],
    });

interface Iprops {
    isLoginPage: boolean;
    setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
    isLoadingDepartments: boolean;
    errorFetchingDepartments: string;
    departmentsList: string[] | undefined;
}

function RegistrationForm({
                              isLoginPage,
                              setIsLoginPage,
                              isLoadingDepartments,
                              errorFetchingDepartments,
                              departmentsList,
                          }: Iprops) {
    //  :: Define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            useremail: "",
            password: "",
            retypePassword: "",
            department: "",
        },
    });

    // :: Define a submit handler
    function handleOnSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    function handleGoToRegistrationPage(event: React.FormEvent) {
        event.preventDefault();
        setIsLoginPage(!isLoginPage);
    }

    // + Render the form
    return (
        <Form {...form}>
            <form
                className="flex flex-col pt-6"
                onSubmit={form.handleSubmit(handleOnSubmit)}
            >
                <FormField
                    control={form.control}
                    name="useremail"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex pt-6 items-center h-10">
                                <FormLabel className="text-white ">Your Work Email</FormLabel>
                                <FormMessage
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input {...field} type="email"/>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex pt-6 items-center h-10">
                                <FormLabel className="text-white">Password</FormLabel>
                                <FormMessage
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input placeholder="" {...field} type="password"/>
                            </FormControl>
                            <FormDescription></FormDescription>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="retypePassword"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex pt-6 items-center h-10">
                                <FormLabel className="text-white ">Re-Password</FormLabel>
                                <FormMessage
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input placeholder="" {...field} type="password"/>
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="department"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex pt-6 items-center h-10">
                                <FormLabel className="text-white ">Your Department</FormLabel>
                                <FormMessage
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select your Department"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {departmentsList && departmentsList.map((department, index) => (
                                        <SelectItem key={index} value={department}>
                                            {department}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormItem>
                    )}
                />

                <div className="flex items-center pt-2">
                    <p>Already registered?</p>
                    <button
                        className="pl-4 underline underline-offset-2"
                        onClick={handleGoToRegistrationPage}
                    >
                        Log In
                    </button>
                </div>

                {isLoadingDepartments ?
                    <p>Fetching departments list...</p>
                    : !departmentsList ?
                        <div className="flex flex-col justify-center items-center h-full mt-8">
                            <p className="text-red-500">Couldn't fetch departments</p>
                            <p className="text-red-500">{}</p>
                            <p className="text-red-500">Contact Support.</p>
                        </div>
                        :
                        <Button
                            className="mt-8 w-[40%] self-center border-2 p-2 rounded-lg hover:shadow-lg "
                            type="submit"
                        >
                            Register
                        </Button>
                }

            </form>
        </Form>
    );
}

export default RegistrationForm;
