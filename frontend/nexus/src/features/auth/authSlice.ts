import {PayloadAction, createSlice} from "@reduxjs/toolkit";
import {IAuthState} from "@/types";
import {RootState} from "@/redux/store";


// ! demo state, in production state will be empty at beginning
const INITIAL_STATE: IAuthState = {
    // user: {
    //   username: "demo_user",
    //   department: "",
    //   team: "",
    //   roles: [101]
    // },
    // accessToken: "some demo token"
    accessToken: undefined,
    user: undefined
};


const authSlice = createSlice({
    name: "auth",
    initialState: INITIAL_STATE,

    reducers: {

        // + add authState -> this has access-token and user object
        setAuthState: (state, action: PayloadAction<IAuthState>) => {
            const {user, accessToken} = action.payload;
            state.user = user;
            state.accessToken = accessToken;
        },

        // + clear the security state from the store
        removeAuthState: (state) => {
            state.user = undefined;
            state.accessToken = undefined;
        },

        // + update accessToken in security-state
        setAccessToken: (state, action: PayloadAction<{ accessToken: string }>) => {
            state.accessToken = action.payload.accessToken;
        }

    },
});


export const {setAuthState, removeAuthState, setAccessToken} = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;