import CORSearchForm from "@pages/department/sales/cor/CORSearchForm.tsx";
import MainLayout from "@templates/MainLayout.tsx";
import CORUpdateForm from "@pages/department/sales/cor/CORUpdateForm.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"


const CoreDashboard = () => {
    return (
        <MainLayout>

            <Tabs defaultValue="search_data" className="w-[100%]">
                <div className="flex m-4 justify-center">
                    <TabsList className="w-[40%] bg-default-bg0">
                        <TabsTrigger value="search_data">
                            <p className="font-semibold text-xl">Search C.O.R Data</p>
                        </TabsTrigger>
                        <TabsTrigger value="upload_data">
                            <p className="font-semibold text-xl">Upload C.O.R Data</p></TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="search_data">
                    <CORSearchForm/>
                </TabsContent>

                <TabsContent value="upload_data">
                    <CORUpdateForm/>
                </TabsContent>

            </Tabs>


        </MainLayout>
    );
};

export default CoreDashboard;
