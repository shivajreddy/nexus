/*
:: This page will have all the rules to edit the data in the dropdown ::
*/


import {Button} from "@components/ui/button.tsx";
import {TiArrowBack} from "react-icons/ti";
import {useNavigate} from "react-router-dom";
import MainLayout from "@templates/MainLayout.tsx";
import EpcMenu from "@pages/department/teclab/Epc/EpcMenu.tsx";
import {Separator} from "@components/ui/separator.tsx";
import {useState} from "react";
import EditFormData from "@pages/department/teclab/Epc/EditFormData.tsx";
import ListItems from "@pages/department/teclab/Epc/ListItems.tsx";


const EditNewLotData = () => {
    const navigate = useNavigate();

    const [activeButton, setActiveButton] = useState<string|null>(null);

    const activateButton = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    const getButtonClass = (buttonName: string) => {
        const baseClass = 'm-4';
        const activeClass = activeButton === buttonName ? 'bg-primary text-primary-fg0 ' : '';
        return `${baseClass} ${activeClass}`;
    };

    const renderContent = () => {
        switch (activeButton) {
            case 'Communities':
                return <div>Content for Communities
                    <EditFormData/>
                </div>;
            case 'Products':
                return <div>Content for Products</div>;
            case 'Elevations':
                return <div>Content for Elevations</div>;
            // Add cases for other buttons

            default:
                return null;
        }
    };

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

                <div className="rounded-lg rounded-t-none bg-default-bg2 px-4 pb-8">
                    <div className="flex justify-center py-4">

                        <button
                            onClick={() => activateButton('Communities')}
                            className={getButtonClass('Communities') +
                                ' border border-b0 p-2 rounded-lg'
                        }>
                            Communities
                        </button>
                        <button
                            onClick={() => activateButton('Products')}
                            className={getButtonClass('Products') +
                                ' border p-2 rounded-lg'
                            }>
                            Products
                        </button>
                        <button
                            onClick={() => activateButton('Elevations')}
                            className={getButtonClass('Elevations') +
                                ' border p-2 rounded-lg'
                            }>
                            Elevations
                        </button>
                        <button
                            onClick={() => activateButton('Engineers')}
                            className={getButtonClass('Engineers') +
                                ' border p-2 rounded-lg'
                            }>
                            Engineers
                        </button>
                        <button
                            onClick={() => activateButton('Plat Engineers')}
                            className={getButtonClass('Plat Engineers') +
                                ' border p-2 rounded-lg'
                            }>
                            Plat Engineers
                        </button>
                        <button
                            onClick={() => activateButton('Jurisdictions')}
                            className={getButtonClass('Jurisdictions') +
                                ' border p-2 rounded-lg'
                            }>
                            Jurisdictions
                        </button>
                    </div>
                    <Separator/>

                    <div className="border mt-4">
                        {renderContent()}
                    </div>

                    <ListItems/>

                </div>

            </div>

        </MainLayout>
    );
};

export default EditNewLotData;