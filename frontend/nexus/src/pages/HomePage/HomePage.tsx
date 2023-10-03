import MainLayout from "@/templates/MainLayout"
import {Button} from "@components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

function HomePage() {

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="home-page">
                <h1> HomePage </h1>

                <Button onClick={() => navigate('/welcome')}>/Welcome</Button>

                <p>User - home page</p>
                <p> Testing alert component </p>
            </div>
            <br/>
        </MainLayout>
    )
}

export default HomePage