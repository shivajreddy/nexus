import MainLayout from "@/templates/MainLayout"
import {Button} from "@components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


function HomePage() {

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="home-page">
                <p className="text-2xl"> HomePage </p>
                <Button onClick={() => navigate('/welcome')}>Go To Welcome Page</Button>
            </div>
            <br/>
        </MainLayout>
    )
}

export default HomePage