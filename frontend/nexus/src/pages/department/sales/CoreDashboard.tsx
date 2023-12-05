import CORSearchForm from "@pages/department/sales/cor/CORSearchForm.tsx";
import MainLayout from "@templates/MainLayout.tsx";
import CORUpdateForm from "@pages/department/sales/cor/CORUpdateForm.tsx";


const CoreDashboard = () => {
    return (
        <MainLayout>
            <CORUpdateForm/>
            <CORSearchForm/>
        </MainLayout>
    );
};

export default CoreDashboard;
