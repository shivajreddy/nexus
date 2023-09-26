import {setAuthState} from "@/features/auth/authSlice";
import {useAppDispatch} from "@/redux/hooks";
import {useDoLoginMutation} from "@/services/test/testSlice";
import {ISecurityState, IUser} from "@/types";

// ? test the login api


function TecLabPageTest1() {

    const [sendLoginRequest, {isLoading, isError, error}] = useDoLoginMutation();
    const dispatch = useAppDispatch();

    async function handleLogin() {
        console.log("handleLogi called");
        try {
            const response = await sendLoginRequest({
                username: "test@eagleofva.com",
                password: "password123"
            });

            // Check if response is an error
            if ('error' in response) {
                // Handle the error case
                console.error("Error:", response.error);
            } else {
                // Handle the successful response here
                console.log("response from 😣", response);
                const data = response.data;
                const userData: IUser = {
                    username: data?.username as string,
                    department: data?.department as string,
                    roles: data?.roles as [number],
                    team: data?.team as string
                };
                const newAuthState: ISecurityState = {accessToken: data?.access_token, user: userData};
                dispatch(setAuthState(newAuthState))
            }
        } catch (error) {
            // Handle any errors here
            console.error("Error:", error);
        }
    }

    // pollingInterval: 5000   // + these are addition settings at the hook level
    // const { data, isLoading, error } = useGetTestDataQuery(undefined);
    // const { data, isLoading, error } = useGetAllUsersQuery(undefined);

    // if (isLoading) return <p>Loading...</p>;
    // if (error) return <p>ERROR fetching. Detail: {JSON.stringify(error)} </p>

    return (
        <div>
            {isError && JSON.stringify(error)}
            {isLoading && <p>Loading...</p>}
            TecLabPageTest1
            <button onClick={handleLogin}>LOGIN</button>
            {/* {data && JSON.stringify(data)} */}
        </div>
    )
}


export default TecLabPageTest1