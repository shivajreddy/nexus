import {Button} from "@/components/ui/button";
import {useNavigate} from "react-router-dom";

function UiErrorPage() {

    const navigate = useNavigate();
    return (
        <div>
            <p> UiErrorPage </p>
            <p> Contact Shiva Reddy with link and screenshot of the console </p>
            <Button variant="outline" onClick={() => navigate(-1)}>Take me back</Button>

        </div>
    );
}

export default UiErrorPage;
