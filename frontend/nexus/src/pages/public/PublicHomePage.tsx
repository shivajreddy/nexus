import {useNavigate} from "react-router-dom";

function PublicHomePage() {
    const navigate = useNavigate();
    return (
        <>
            <h1>Welcome to Nexus</h1>
            <button onClick={() => navigate('/')}>Go to /</button>
        </>
    )
}

export default PublicHomePage