import MainLayout from "@templates/MainLayout.tsx";
import NewLotForm from "@pages/department/teclab/Epc/NewLot/NewLotForm.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";

function NewLot() {
    const navigate = useNavigate();
    return (
        <MainLayout>
            <div className="epc-header border">
                <div className="border-r-2">
                    <h1 className="font-bold lg:text-2xl"> Eagle Projects Console </h1>
                </div>

                <div className="flex mx-10 items-center">
                    {/* TODO: this should be role specific*/}
                    <div className="flex justify-center items-center">
                        <button className="flex justify-center items-center" onClick={() => navigate('/epc')}>
                            <p className="pr-2"><TiArrowBack/></p>
                            Back to EPC
                        </button>
                    </div>
                </div>
            </div>
            {/* TODO: add header of EPC*/}
            <NewLotForm/>
        </MainLayout>
    );
}

export default NewLot;
