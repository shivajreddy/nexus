import BaseThemeContainer from "@templates/BaseThemeContainer.tsx";
import '@/assets/pages/auth/SuccessfulRegistration.css'
import {Button} from "@components/ui/button.tsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import LoadingSpinner from "@components/common/LoadingSpinner.tsx";
import axios, {AxiosError} from "axios";
import {BASE_URL} from "@/services/api";


type RegistrationStatus = "loading" | "success" | "failed" | "already_verified";

function SuccessfulRegistration() {

    const navigate = useNavigate();

    const {user_email, email_verification_key} = useParams<{ user_email: string, email_verification_key: string }>();

    const [registrationStatus, setRegistrationStatus] = useState<RegistrationStatus>('loading');

    useEffect(() => {
        // TODO - make an axios call to the end point
        const fn = async () => {
            const registration_confirmation_url = BASE_URL + "/auth/confirm-registration" + `/${user_email}` + `/${email_verification_key}`;
            try {
                const response = await axios.get(registration_confirmation_url);
                console.log("response=", response);
                switch (response.status) {
                    case 200:
                        setRegistrationStatus('success')
                        break;
                    case 403:
                        setRegistrationStatus("failed");
                        break;
                }
            } catch (e) {
                if ((e as AxiosError).response?.status === 304) {
                    setRegistrationStatus('already_verified');
                } else {
                    console.log("error::", e)
                    setRegistrationStatus("failed");
                }
            }
        }
        fn();
    }, [])


    return (
        <>
            <BaseThemeContainer>
                <div className="main-container">
                    {
                        registrationStatus === 'loading' ?
                            <LoadingSpinner width={50}/>
                            :
                            registrationStatus === 'success' ?
                                <div className="thank-you-wrapper">
                                    <div className="check-mark-block">
                                        <div className="check-mark-wrapper">
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold loadup">Yay!</p>
                                    <p className="text-md loadup">You have successfully Registered!</p>
                                    <br/>
                                    <Button id="login" onClick={() => navigate('/login')}> Log in </Button>
                                </div>
                                :
                                registrationStatus === 'already_verified' ?
                                    <div className="thank-you-wrapper">
                                        <div className="check-mark-block">
                                            <div className="check-mark-wrapper">
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold loadup">Hmm...</p>
                                        <p className="text-md loadup">You have already verified your account!</p>
                                        <br/>
                                        <Button id="login" onClick={() => navigate('/login')}> Log in </Button>
                                    </div>
                                    :
                                    <div className="thank-you-wrapper">
                                        <div className="fail-mark-block">
                                            <div className="fail-mark-wrapper">
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                        <p className="text-xl font-bold loadup">OOPS!</p>
                                        <p className="text-md loadup">Failed to Register!</p>
                                        <p className="text-md loadup">Contact support!</p>
                                    </div>
                    }
                </div>
            </BaseThemeContainer>
        </>
    )
}


export default SuccessfulRegistration;
