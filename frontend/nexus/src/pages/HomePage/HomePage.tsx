import MainLayout from "@/templates/MainLayout"
import {AlertError} from "@pages/auth/AlertError.tsx";

function HomePage() {

    return (
        <MainLayout>
            <div className="home-page">
                <h1> HomePage </h1>
                <p>User - home page</p>
                <p> Testing alert component </p>
                <AlertError/>
            </div>
            <br/>
        </MainLayout>
    )
}

export default HomePage