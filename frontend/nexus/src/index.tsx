import ReactDOM from "react-dom/client";
import {
    Route,
    RouterProvider,
    createBrowserRouter,
    createRoutesFromElements,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/redux/store";
import "@assets/index.css";
import HomePage from "@/pages/HomePage/HomePage";
import Epc from "@pages/department/teclab/Epc/View/Epc.tsx";
import Updates from "@pages/Updates/Updates";
import Pipeline from "@pages/pipeline/Pipeline";
import UserHome from "@pages/User/UserHome";
import PageNotFound from "@/pages/common/PageNotFound";
import UiErrorPage from "@/pages/common/UiErrorPage";
import LoginPage from "@/pages/auth/LoginPage";
import AuthRequired from "@/features/auth/AuthRequired";
import PublicHomePage from "@/pages/public/PublicHomePage";
import SalesPageTest1 from "./pages/department/sales/SalesPageTest1";
import SalesPageTest2 from "./pages/department/sales/SalesPageTest2";
import AuthTecLab from "./pages/department/teclab/AuthTecLab";
import AuthSales from "./pages/department/sales/AuthSales";
import SalesHome from "./pages/department/sales/SalesHome";
import TecLabHome from "./pages/department/teclab/TecLabHome";
import PersistentLogin from "@/features/auth/PersistentLogin.tsx";
import SuccessfulRegistration from "@pages/auth/SuccessfulRegistration.tsx";
import SearchAndUpdateEPCTECLabData from "@pages/department/teclab/Epc/View/SearchAndUpdateTECLabData.tsx";
import SearchAndUpdateFOSCData from "@pages/department/teclab/Fosc/Views/SearchAndUpdateFOSCData.tsx";


import Fosc from "@pages/department/teclab/Fosc/Views/Fosc.tsx";
// import EditNewLotData from "@pages/department/teclab/Epc/EditNewLotData.tsx";
// import EditLot from "@pages/department/teclab/Epc/EditLot/EditLot.tsx";
import CoreDashboard from "@pages/department/sales/CoreDashboard.tsx";
import EPCAll from "@pages/department/teclab/Epc/View/EPCAll.tsx";
// import FindProject from "@pages/Project/FindProject.tsx";
import Projects from "@pages/Project/Projects.tsx";
import EditTECLabData from "@pages/department/teclab/Epc/View/EditTECLabData.tsx";
import DemoGrid from "@pages/department/teclab/Epc/archive/DemoGrid.tsx";
import Epc2 from "@pages/department/teclab/Epc/archive/Epc2.tsx";
import EditFOSCData from "@pages/department/teclab/Fosc/Views/EditFOSCData.tsx";
import FOSCSummary from "@pages/department/teclab/Fosc/Views/FOSCSummary.tsx";
import FOSCCurrent from "@pages/department/teclab/Fosc/Views/FOSCCurrent.tsx";
import FOSCAll from "@pages/department/teclab/Fosc/Views/FOSCAll.tsx";
import AddFOSCProject from "@pages/department/teclab/Fosc/Views/AddFOSCProject.tsx";
import DashboardPage from "./pages/department/teclab/Dashboard/DashboardPage";
import AuthEpc from "./pages/department/teclab/Epc/AuthEpc";
import AuthFosc from "./pages/department/teclab/Fosc/AuthFosc";
import AuthFoscChanges from "./pages/department/teclab/Fosc/AuthFoscChanges";
import AuthAdmin from "./pages/auth/AuthAdmin";
import AuthEpcChanges from "./pages/department/teclab/Epc/AuthEpcChanges";
import AuthDashboard from "./pages/department/teclab/Dashboard/AuthDashboard";
import AuthProjects from "./pages/Project/AuthProjects";

import AuthWarrantyDashboard from "./pages/department/teclab/Dashboard/Warranty/AuthWarrantyDashboard";
import WarrantyDashboardPage from "./pages/department/teclab/Dashboard/Warranty/WarrantyDashboardPage";
import AuthGraphs from "./pages/department/teclab/graphs/AuthGraphs";
import GraphsHomePage from "./pages/department/teclab/graphs/GraphsHomepage";
import { SaveProject } from "./pages/dev/project/SaveProject";
import { EpcProjectWithIHMS } from "./pages/dev/EpcProjectWithIHMS";

// # Router configuration
const router = createBrowserRouter(



    createRoutesFromElements(
        <Route errorElement={<UiErrorPage />}>

            {/* Public pages */}
            <Route path="welcome" element={< PublicHomePage />} />
            <Route path="login" element={< LoginPage />} />
            <Route path="wtf" element={< SuccessfulRegistration />} />
            <Route path="auth/confirm-registration/:user_email/:email_verification_key"
                element={< SuccessfulRegistration />} />

            {/* Secured pages */}
            <Route element={<PersistentLogin />}>
                <Route element={<AuthRequired />}>
                    <Route path="/" element={<HomePage />} />
                    {/*<Route path="epc" element={<EpcTest1/>}/>*/}

                    <Route path="projects" element={<AuthProjects />}>
                        <Route index element={<Projects />} />
                        {/* <Route path="search" element={<FindProject />} /> */}
                        {/* <Route path="new" element={} /> */}
                    </Route>

                    <Route path="dashboard" element={<AuthDashboard />}>
                        <Route index element={<DashboardPage />} />
                    </Route>
                    <Route path="dashboard2" element={<AuthWarrantyDashboard />}>
                        <Route index element={<WarrantyDashboardPage />} />
                    </Route>
                    <Route path="graphs" element={<AuthGraphs />}>
                        <Route index element={<GraphsHomePage />} />
                    </Route>

                    <Route path="epc" element={<AuthEpc />}>
                        <Route index element={<Epc />} />
                        <Route path="all-lots" element={<EPCAll />} />
                        <Route element={<AuthEpcChanges />}>
                            <Route path="edit" element={<SearchAndUpdateEPCTECLabData />} />
                            <Route path="edit/:project_uid" element={<EditTECLabData />} />
                        </Route>

                        <Route element={<AuthAdmin />}>
                            <Route path="epc2" element={<Epc2 />} />
                            <Route path="test" element={<DemoGrid />} />
                            {/*<Route path="edit-newlot-form-data" element={<EditNewLotData/>}/>*/}
                            {/*<Route path="lot/new" element={<EditTECLabData/>}/>*/}
                            {/*<Route path="edit2" element={<EditTECLabData/>}/>*/}
                        </Route>
                    </Route>

                    <Route path="fosc" element={<AuthFosc />}>
                        <Route index element={<Fosc />} />
                        <Route path="all-lots" element={<FOSCAll />} />
                        <Route path="summary" element={<FOSCSummary />} />
                        <Route path="current" element={<FOSCCurrent />} />

                        <Route element={<AuthFoscChanges />}>
                            <Route path="add" element={<AddFOSCProject />} />
                            <Route path="edit" element={<SearchAndUpdateFOSCData />} />
                            <Route path="edit/:project_uid" element={<EditFOSCData />} />
                        </Route>
                    </Route>

                    <Route path="pipeline" element={<Pipeline />} />
                    <Route path="core-dashboard" element={<CoreDashboard />} />
                    <Route path="updates" element={<Updates />} />
                    <Route path="user" element={<UserHome />} />

                    {/* Testing role specific page */}
                    <Route path="/teclab" element={<AuthTecLab />}>
                        <Route index element={<TecLabHome />} /> {/* This is the homepage for /teclab */}
                    </Route>

                    <Route path="sales" element={<AuthSales />}>
                        <Route index element={<SalesHome />} /> {/* This is the homepage for /sales */}
                        <Route path="page1" element={<SalesPageTest1 />} />
                        <Route path="page2" element={<SalesPageTest2 />} />
                    </Route>
                </Route>
            </Route>

            {/* 404 Page */}
            < Route path="*" element={< PageNotFound />} />

            {/* DEV PAGES : UNDER DEVELOPMENT*/}
            <Route path="/dev/saveproject/p1" element={<SaveProject />} />
            <Route path="/dev/newepc" element={<EpcProjectWithIHMS />} />

        </Route>
    )
);

// const nexus_text_logo = (
//     "                                                   " + "©\n" +
//     "███   ██   ███████   ██   ██   ██   ██   ████████\n" +
//     "████  ██   ██         ██ ██    ██   ██   ██      \n" +
//     "██ ██ ██   ███████     ███     ██   ██   ████████\n" +
//     "██  ████   ██         ██ ██    ██   ██         ██\n" +
//     "██   ███   ███████   ██   ██   ███████   ████████" + "     " + "created with ❤️ by Shiva Reddy"
// )
// console.log(nexus_text_logo);


ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);

