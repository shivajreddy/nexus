import RegistrationForm from "./RegistrationForm";
import {useGetAllDepartmentsQuery} from "@pages/auth/eagleApiSlice.ts";
import React from "react";

interface Iprops {
    isLoginPage: boolean;
    setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegistrationCard({isLoginPage, setIsLoginPage}: Iprops) {

    // + call the department-api
    const {data, isLoading, error} = useGetAllDepartmentsQuery(undefined);
    // console.log("data = ", data, isLoading, error)

    return (
        <div className="p-10 flex flex-col justify-center w-[100%]">
            <p className="font-bold text-4xl">Register</p>
            <p>Create your Nexus account</p>
            <RegistrationForm
                isLoginPage={isLoginPage}
                setIsLoginPage={setIsLoginPage}

                isLoadingDepartments={isLoading}
                errorFetchingDepartments={JSON.stringify(error)}
                departmentsList={data}
            />
        </div>
    );
}

export default RegistrationCard;
