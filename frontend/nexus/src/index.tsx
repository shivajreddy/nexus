import ReactDOM from "react-dom/client";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import {Provider} from "react-redux";
import store from "@/redux/store";
import "@assets/index.css";
import HomePage from "@/pages/HomePage/HomePage";
import Epc from "@/pages/department/teclab/Epc/Epc";
import Updates from "@pages/Updates/Updates";
import Tasks from "@pages/Tasks/Tasks";
import Pipeline from "@pages/Pipeline/Pipeline";
import UserHome from "@pages/User/UserHome";
import PageNotFound from "@/pages/common/PageNotFound";
import UiErrorPage from "@/pages/common/UiErrorPage";
import LoginPage from "@/pages/auth/LoginPage";
import AuthRequired from "@/features/auth/AuthRequired";
import PublicHomePage from "@/pages/public/PublicHomePage";
import TecLabPageTest1 from "./pages/department/teclab/TecLabPageTest1";
import TecLabPageTest2 from "./pages/department/teclab/TecLabPageTest2";
import SalesPageTest1 from "./pages/department/sales/SalesPageTest1";
import SalesPageTest2 from "./pages/department/sales/SalesPageTest2";
import AuthTecLab from "./pages/department/teclab/AuthTecLab";
import AuthSales from "./pages/department/sales/AuthSales";
import SalesHome from "./pages/department/sales/SalesHome";
import TecLabHome from "./pages/department/teclab/TecLabHome";
import PersistentLogin from "@/features/auth/PersistentLogin.tsx";
import SuccessfulRegistration from "@pages/auth/SuccessfulRegistration.tsx";
import NewLot from "@pages/department/teclab/Epc/NewLot/NewLot.tsx";
import EditNewLotData from "@pages/department/teclab/Epc/EditNewLotData.tsx";

// # Router configuration
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route errorElement={<UiErrorPage/>}>

            {/* Public pages */}
            <Route path="welcome" element={< PublicHomePage/>}/>
            <Route path="login" element={< LoginPage/>}/>
            <Route path="wtf" element={< SuccessfulRegistration/>}/>
            <Route path="auth/confirm-registration/:user_email/:email_verification_key"
                   element={< SuccessfulRegistration/>}/>

            {/* Secured pages */}
            <Route element={<PersistentLogin/>}>
                <Route element={<AuthRequired/>}>
                    <Route path="/" element={<HomePage/>}/>
                    {/*<Route path="epc" element={<EpcTest1/>}/>*/}
                    <Route path="epc">
                        <Route index element={<Epc/>}/>
                        <Route path="lot/new" element={<NewLot/>}/>
                        <Route path="edit-newlot-form-data" element={<EditNewLotData/>}/>
                    </Route>

                    <Route path="pipeline" element={<Pipeline/>}/>
                    <Route path="tasks" element={<Tasks/>}/>
                    <Route path="updates" element={<Updates/>}/>
                    <Route path="user" element={<UserHome/>}/>

                    {/* Testing role specific page */}
                    <Route path="/teclab" element={<AuthTecLab/>}>
                        <Route index element={<TecLabHome/>}/> {/* This is the homepage for /teclab */}
                        <Route path="page1" element={<TecLabPageTest1/>}/>
                        <Route path="page2" element={<TecLabPageTest2/>}/>
                    </Route>

                    <Route path="sales" element={<AuthSales/>}>
                        <Route index element={<SalesHome/>}/> {/* This is the homepage for /sales */}
                        <Route path="page1" element={<SalesPageTest1/>}/>
                        <Route path="page2" element={<SalesPageTest2/>}/>
                    </Route>
                </Route>
            </Route>

            {/* 404 Page */}
            < Route path="*" element={< PageNotFound/>}/>

        </Route>
    )
);

// const nexus_text_logo = (
//     "                                                   " + "©\n" +
//     "███   ██   ███████   ██   ██   ██   ██   ████████\n" +
//     "████  ██   ██         ██ ██    ██   ██   ██      \n" +
//     "██ ██ ██   ███████     ███     ██   ██   ████████\n" +
//     "██  ████   ██         ██ ██    ██   ██         ██\n" +
//     "██   ███   ███████   ██   ██   ███████   ████████" + "     " + "with ❤️ by Shiva Reddy"
// )
// console.log(nexus_text_logo);


ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router}/>
    </Provider>
);

