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
import {ISecurityState, IUser} from "@/types";
import {useLoginMutation} from "@/features/auth/authApiSlice";
import React from "react";

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
            // useremail: "",
            // password: "",
            useremail: "1test@eagleofva.com",
            password: "password123"
        },
    });

    // $ handle login with apislice and authslice
    const [sendLoginRequest, {isLoading, isError, error}] = useLoginMutation();
    const dispatch = useAppDispatch();

    const location = useLocation();
    const fromLocation = location.state?.from?.pathname || "/";
    const navigate = useNavigate();

    // + 3. Define a submit handler
    async function handleOnSubmit(values: z.infer<typeof formSchema>) {
        console.log("handleOnSubmit fn called at LoginForm.tsx");
        try {
            const response = await sendLoginRequest({
                username: values.useremail,
                password: values.password
            });

            // Check if response is an error
            if ('error' in response) { // Handle the error case
                console.error("Error:", response.error);
            } else { // Handle the successful response here
                const data = response.data;
                const userData: IUser = {
                    username: data?.username as string,
                    department: data?.department as string,
                    roles: data?.roles as [number],
                    team: data?.team as string
                };
                const newAuthState: ISecurityState = {accessToken: data?.access_token, user: userData};
                dispatch(setAuthState(newAuthState))
                // console.log("finished setting the AuthState, now going to navigate to where you came from", fromLocation)
                navigate(fromLocation, {replace: true}) // + after login send back to where the user came from
                // console.log("finished navigating to", fromLocation)
            }
        } catch (error) {
            console.error("Error:", error); // Handle any errors here
        }
    }

    function handleGoToRegistrationPage(event: React.FormEvent) {
        event.preventDefault();
        setIsLoginPage(!isLoginPage);
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
                                <FormLabel className="text-white ">Email</FormLabel>
                                <FormMessage
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input placeholder="" type="email" {...field} />
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
                                    className="pl-4 text-white underline underline-offset-4 decoration-red-600 "/>
                            </div>
                            <FormControl>
                                <Input placeholder="" type="password" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex items-center pt-2">
                    <p>Don't have an account? </p>
                    <button
                        className="pl-4 underline underline-offset-2"
                        onClick={handleGoToRegistrationPage}
                    >
                        Sign Up
                    </button>
                </div>

                <div>
                    {isError ?
                        <p>{JSON.stringify(error)}</p>
                        : isLoading
                            ? <p>Loading...</p>
                            :
                            <button
                                className="mt-8 w-[40%] self-center border-2 p-2 rounded-lg hover:shadow-lg "
                                type="submit"
                            >
                                Login
                            </button>
                    }
                </div>
            </form>
        </Form>
    );
}

export default LoginForm;
