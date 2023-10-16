import {GetFromLS, SaveToLS} from "@/hooks";
import {createSlice} from "@reduxjs/toolkit";

interface ISidebarStatusState {
    isOpen: boolean;
}

const INITIAL_STATE: ISidebarStatusState = {
    isOpen: GetFromLS("isSidebarOpen", "false") === "false" ? false : true,
};

function toggleSidebar(state: ISidebarStatusState) {
    state.isOpen = !state.isOpen;
    SaveToLS("isSidebarOpen", String(state.isOpen));
}

const sidebarSlice = createSlice({
    name: "Sidebar Status",
    initialState: INITIAL_STATE,
    reducers: {
        toggleSidebar_action: toggleSidebar,
    },
});


export const {toggleSidebar_action} = sidebarSlice.actions;

export default sidebarSlice.reducer;
