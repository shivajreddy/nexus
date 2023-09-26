import { useEffect, useState } from "react";
import axios from "axios";

import RegistrationForm from "./RegistrationForm";
import { BASE_URL } from "@/services/api";

interface Iprops {
  isLoginPage: boolean;
  setIsLoginPage: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegistrationCard({ isLoginPage, setIsLoginPage }: Iprops) {
  const [allDepartments, setAllDepartments] = useState<string[]>([]);

  console.log("allDepartments=", allDepartments);

  useEffect(() => {
    const result = axios.get(BASE_URL + "/eagle-data/departments");
    result.then((response) => {
      console.log("data= ", response.data);
      setAllDepartments(response.data);
    });
  }, []);

  return (
    <div className="p-10 flex flex-col justify-center w-[100%]">
      <p className="font-bold text-4xl">Register</p>
      <p>Create your Nexus account</p>
      <RegistrationForm
        isLoginPage={isLoginPage}
        setIsLoginPage={setIsLoginPage}
        departmentsList={allDepartments}
      />
    </div>
  );
}

export default RegistrationCard;
