import { createSlice } from "@reduxjs/toolkit";
import { revenueData } from "@/features/admin/data/staticData"; // sesuaikan path

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        revenueData,
        sidebarOpen: true,
    },
    reducers: {
        toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen; },
    },
});

export const { toggleSidebar } = dashboardSlice.actions;
export default dashboardSlice.reducer;