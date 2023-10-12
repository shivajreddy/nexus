import MainLayout from "@templates/MainLayout.tsx";
import NewLotForm from "@pages/department/teclab/Epc/NewLot/NewLotForm.tsx";
import {BsPlusCircleFill} from "react-icons/bs";
import {CgMenuGridO} from "react-icons/cg";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import {useNavigate} from "react-router-dom";

function NewLot() {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="epc-header border">
                <div className="border-r-2">
                    <h1 className="font-bold lg:text-2xl"> Eagle Projects Console </h1>
                </div>

                <div className="flex mx-10">
                    {/* TODO: this should be role specific*/}
                    <div className="flex justify-center items-center">
                        <button className="flex justify-center items-center" onClick={() => navigate('/epc')}>
                            <p className="pr-2"><BsPlusCircleFill/></p>
                            EPC-Live
                        </button>
                    </div>
                    <div className="flex justify-center items-center ml-8">
                        <button className="flex justify-center items-center" onClick={() => navigate('/epc/all-lots')}>
                            <p className="pr-2"><CgMenuGridO/></p>
                            All Lots
                        </button>
                    </div>

                    <EpcMenu/>

                </div>
            </div>
            {/* TODO: add header of EPC*/}
            <NewLotForm/>
        </MainLayout>
    );
}

export default NewLot;
