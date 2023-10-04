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
import React, {useState} from "react";
import axios from "axios";
import {BASE_URL, REGISTRATION_ENDPOINT} from "@/services/api";
import LoadingSpinner from "@components/common/LoadingSpinner.tsx";
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import {BiError} from "react-icons/bi";
import {FaCheckSquare} from "react-icons/fa";


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
                    // message: "( Use @eagleofva.com or @tecofva.com )",
                    message: "(Invalid Email domain)",
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
    // fetchErrorDetail: string;
    departmentsList: string[] | undefined;
}

type RegistrationStatus = "loading" | "success" | "fail" | undefined;

function RegistrationForm({
                              isLoginPage,
                              setIsLoginPage,
                              isLoadingDepartments,
                              // fetchErrorDetail,
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
            // useremail: "2test@eagleofva.com",
            // password: "password123",
            // retypePassword: "password123",
            // department: "TEC Lab",
        },
    });

    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>(undefined);
    const [errorRegistering, setErrorRegistering] = useState<{ title: string, detail: string }>();

    // :: Define a submit handler
    async function handleOnSubmit(values: z.infer<typeof formSchema>) {
        setRegistrationStatus('loading');
        const postData = {"username": values.useremail, "plain_password": values.password}
        try {
            await axios.post(BASE_URL + REGISTRATION_ENDPOINT, postData);
            setRegistrationStatus('success');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    setRegistrationStatus('fail');
                    setErrorRegistering({title: "Already Registered", detail: `${error.response.data.detail}`})
                } else if (error.response?.data.detail.startsWith("Failed to send email")) {
                    setRegistrationStatus('fail');
                    setErrorRegistering({title: "SERVER ERROR: Failed to Send email", detail: "Contact Support!"})
                } else {
                    setRegistrationStatus('fail');
                    setErrorRegistering({title: "SERVER ERROR", detail: "Contact Support!"})
                }
            }
        }
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


                <div className="flex flex-col justify-center">
                    {isLoadingDepartments ?
                        <div className="flex items-center pt-4">
                            <LoadingSpinner width={20}/>
                            <p>Fetching departments list...</p>
                        </div>
                        : !departmentsList ?
                            <div className="pt-6">
                                <Alert variant="destructive">
                                    <BiError/>
                                    <AlertTitle>Error Fetching Eagle Departments</AlertTitle>
                                    <AlertDescription>Contact Support</AlertDescription>
                                </Alert>
                            </div>
                            :
                            <div className="pt-4 flex justify-center items-center">
                                {
                                    registrationStatus === 'loading' ?
                                        <LoadingSpinner width={45}/>
                                        :
                                        registrationStatus === 'success' ?
                                            <Alert variant="success">
                                                <FaCheckSquare/>
                                                <AlertTitle>Registration Successful</AlertTitle>
                                                <AlertDescription>Click on the link sent to your email, to finish
                                                    registration</AlertDescription>
                                            </Alert>
                                            :
                                            registrationStatus === 'fail' ?
                                                <Alert variant="destructive">
                                                    <BiError/>
                                                    <AlertTitle>{errorRegistering?.title}</AlertTitle>
                                                    <AlertDescription>
                                                        <p>{errorRegistering?.detail}</p>
                                                    </AlertDescription>
                                                </Alert>
                                                :
                                                <Button
                                                    className="mt-8 w-[40%] self-center border-2 p-2 rounded-lg hover:shadow-lg "
                                                    type="submit"
                                                >
                                                    Register
                                                </Button>
                                }
                            </div>
                    }
                </div>

            </form>
        </Form>
    );
}


export default RegistrationForm;
