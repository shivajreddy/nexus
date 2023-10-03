import LoginCard from "./LoginCard";
import RegistrationCard from "./RegistrationCard";
import "@/assets/pages/User/authorization.css";
import {useState} from "react";
import eagleLogoIcon from "@assets/images/ealge-png-white.png";
import tecLogo from "@assets/images/TEC_White_Logo.png";

import NVector from "@assets/images/logo/n-vector.png";
import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";

function LoginPage() {
    const [isLoginPage, setIsLoginPage] = useState(true);

    return (
        <BaseThemeContainer>
            <div className="authorization-page">
                <div className="authorization-body">
                    <div className="blob"></div>

                    <div
                        className="
          card
          flex
          min-w-[70%]
          lg:min-w-[70%]
          xl:min-w-[70%]
          2xl:min-w-[55%]"
                    >
                        <div
                            id="left-box"
                            className="hidden lg:flex
            flex-col
            justify-between
            w-[50%]
            p-6
            py-10
            rounded-l-[1rem]
            items-center
            select-none
            pointer-events-none"
                        >
                            <img src={NVector} width="19%" alt="nexus-logo"/>
                            <div className="text-center">
                                <p className="text-4xl font-bold">NEXUS</p>
                                <p className="opacity-70">Empowering Home Builders</p>
                            </div>
                            <div>
                                <div className="flex">
                                    <img src={tecLogo} width="100px" className="opacity-80 px-5" alt="nexus-tec-logo"/>
                                    <img
                                        src={eagleLogoIcon}
                                        width="100px"
                                        className="opacity-60 px-5"
                                        alt="nexus-eagle-logo"
                                    />
                                </div>
                                <p className="text-sm mt-3 opacity-50">
                                    Designed for Eagle, by Eagle.
                                </p>
                            </div>
                        </div>
                        {isLoginPage ? (
                            <LoginCard
                                isLoginPage={isLoginPage}
                                setIsLoginPage={setIsLoginPage}
                            />
                        ) : (
                            <RegistrationCard
                                isLoginPage={isLoginPage}
                                setIsLoginPage={setIsLoginPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </BaseThemeContainer>
    );
}

export default LoginPage;
