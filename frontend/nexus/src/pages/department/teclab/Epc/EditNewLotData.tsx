/*
:: This page will have all the rules to edit the data in the dropdown ::
*/


import {Button} from "@components/ui/button.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";
import MainLayout from "@templates/MainLayout.tsx";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";


const EditNewLotData = () => {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div>
                <div className="epc-header rounded rounded-b-none py-2 border-b">
                    <div className="border-r flex items-center">
                        <p className="font-semibold lg:text-2xl pl-4"> Eagle Projects Console</p>
                        <p className="ml-4 font-semibold text-primary text-xl">Edit Form Data</p>
                    </div>

                    <div className="flex mx-10 items-center">
                        {/* TODO: this should be role specific*/}
                        <div className="flex justify-center items-center">
                            <Button variant="outline" className="flex justify-center items-center"
                                    onClick={() => navigate('/epc')}>
                                <p className="pr-2"><TiArrowBack/></p>
                                Back to EPC
                            </Button>
                            <EpcMenu/>
                        </div>
                    </div>
                </div>

            </div>

        </MainLayout>
    );
};

export default EditNewLotData;