import axios from "axios";
import {useAppDispatch} from "@redux/hooks.ts";
import {removeAuthState, setAuthState} from "@/features/auth/authSlice.ts";
import {IAuthState, IUser} from "@/types";
import {BASE_URL, REFRESH_ENDPOINT} from "@/services/api";
import {useLocation, useNavigate} from "react-router-dom";


const useRefreshToken = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const fromLocation = location ? location.pathname : "/welcome"

    const refresh = async () => {

        try {        // + make a request to server @refresh-endpoint
            // + make a async-await request to server
            const response = await axios.get(BASE_URL + REFRESH_ENDPOINT, {
                withCredentials: true
            })

            // + grab the data from the response
            const data = response.data;
            const new_userData: IUser = {
                username: data.username,
                department: data.department,
                team: data.team,
                roles: data.roles
            }
            const new_authState: IAuthState = {
                accessToken: data.new_access_token,
                user: new_userData
            }

            // + update the state in store
            dispatch(setAuthState(new_authState));
            return new_authState;

        } catch (error) {   // + refreshToken expired/wrong, => send to login
            console.error("ERROR from /auth/refresh: ", error)
            dispatch(removeAuthState()) // + remove authState
            console.log("Taking back to 'fromLocation'", fromLocation)

            // + send to where they came from
            return navigate('/login', {state: {from: fromLocation}, replace: true})
        }
    }
    return refresh;
}

export default useRefreshToken;

