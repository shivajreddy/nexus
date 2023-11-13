import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {useAppDispatch} from "@/redux/hooks";
import {useLocation, useNavigate} from "react-router-dom";
import {setAuthState} from "@/features/auth/authSlice";
import {IAuthState, IUser} from "@/types";
import {useLoginMutation} from "@/features/auth/authApiSlice";
import React, {useState} from "react";
import {Alert, AlertDescription, AlertTitle} from "@components/ui/alert.tsx";
import {BiError} from 'react-icons/bi'
import LoadingSpinner from "@components/common/LoadingSpinner.tsx";
import {Button} from "@components/ui/button.tsx";


interface Iprops {
    isLoginPage: boolean;
    setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

// + 1. Form Schema
const formSchema = z.object({
    useremail: z
        .string()
        .email("Invalid email format")
        .refine(
            (value) =>
                value.endsWith("@eagleofva.com") || value.endsWith("@tecofva.com"),
            {
                message: "( Email must end with @eagleofva.com or @tecofva.com )",
            }
        ),
    password: z.string().min(1, "( Password can't be empty )"),
});


function LoginForm({isLoginPage, setIsLoginPage}: Iprops) {

    // + 2. Define form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            useremail: "",
            password: "",
            // useremail: "test@tecofva.com",
            // password: "password123"
        },
    });

    // + handle login with apislice and authslice
    const [sendLoginRequest, {isLoading, isError}] = useLoginMutation();
    const dispatch = useAppDispatch();

    const location = useLocation();
    const fromLocation = location.state?.from?.pathname || "/";
    const navigate = useNavigate();

    // const [errorDetail, setErrorDetail] = useState<string>("");
    const [errorDetail, setErrorDetail] = useState<{ title: string, content: string }>();

    // + 3. Define a submit handler
    async function handleOnSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await sendLoginRequest({
                username: values.useremail,
                password: values.password
            });

            // Check if response is an error
            // console.log("🐢✅ response =", response);
            // console.log(isLoading)
            // console.log(isError, error)

            if (response && 'error' in response) { // Ensure that response exists and has an 'error' property
                console.error("response.error:", response.error);
                if ((response.error as any).status === 404) {
                    // setErrorDetail(`${values.useremail} is not registered`);
                    setErrorDetail({
                        title: "Account not found",
                        content: `${values.useremail} is not registered on Nexus`
                    })
                } else if ((response.error as any).status === 412) {
                    // setErrorDetail(`${values.useremail} is not Verified. Please check your email
                    // for a verification link and follow the instructions to verify your account`);
                    setErrorDetail({
                        title: "Incomplete Registration",
                        content: `${values.useremail} is not Verified. Please check your email
                        for a verification link and follow the instructions to verify your account`
                    })
                } else if ((response.error as any).status === 401) {
                    // setErrorDetail("Wrong password");
                    setErrorDetail({title: "Login Failed", content: "Invalid Credentials"})
                } else {
                    // setErrorDetail(JSON.stringify(response.error))
                    setErrorDetail({title: "Complete Detail", content: JSON.stringify(response.error)})
                }
            } else { // Handle the successful response here
                // console.log("🐌 no error in response")
                const data = response.data;
                const userData: IUser = {
                    username: data?.username as string,
                    department: data?.department as string,
                    roles: data?.roles as [number],
                    team: data?.team as string
                };
                const newAuthState: IAuthState = {accessToken: data?.access_token, user: userData};
                dispatch(setAuthState(newAuthState))
                navigate(fromLocation, {replace: true})
            }
        } catch (error) {
            console.error("Error:", error); // Handle any errors here
        }
    }

    function handleGoToRegistrationPage(event: React.FormEvent) {
        event.preventDefault();
        setIsLoginPage(!isLoginPage);
    }

    // + 5. Handle Enter key press
    function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Enter') {
            event.preventDefault();
            form.handleSubmit(handleOnSubmit)();
        }
    }

    // ! 4. Render the form
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
                                <FormLabel className="text-white">Email</FormLabel>
                                <FormMessage
                                    className="pl-4 underline underline-offset-4 decoration-red-600"/>
                            </div>
                            <FormControl>
                                <Input className="text-xl text-white bg-transparent"
                                       onKeyDown={handleKeyPress}
                                       placeholder=""
                                       type="email" {...field} />
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
                                <FormLabel className="text-white ">Password</FormLabel>
                                <FormMessage
                                    className="pl-4 underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input className="text-xl text-white bg-transparent"
                                       onKeyDown={handleKeyPress}
                                       placeholder=""
                                       type="password" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />


                <div className="flex flex-col justify-center">
                    <div className="flex items-center p-2">
                        <p className="font-normal text-white">Don't have an account? </p>
                        <button
                            className="ml-2 text-white underline"
                            onClick={handleGoToRegistrationPage}
                        >
                            Sign Up
                        </button>
                    </div>
                    <div className="flex justify-center items-center p-2">
                        {isError ?
                            <Alert variant="destructive">
                                <BiError/>
                                <AlertTitle>{errorDetail?.title}</AlertTitle>
                                <AlertDescription>{errorDetail?.content}</AlertDescription>
                            </Alert>
                            : isLoading
                                ? <LoadingSpinner width={30}/>
                                :
                                <Button
                                    className="bg-transparent text-white hover:text-white hover:bg-transparent"
                                    variant="inverted"
                                    type="submit"
                                >
                                    Login
                                </Button>
                        }
                    </div>
                </div>

            </form>
        </Form>
    );
}

export default LoginForm;
