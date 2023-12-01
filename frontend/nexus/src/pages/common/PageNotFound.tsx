import MainLayout from "@templates/MainLayout.tsx";
import {Button} from "@components/ui/button.tsx";
import {useNavigate} from "react-router-dom";


function PageNotFound() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div
                className="m-10 flex flex-col justify-center items-center min-h-[calc(100vh-130px)] bg-default-bg1 rounded-md">
                <p className="text-9xl font-bold p-5">404</p>
                <p className="text-2xl font-semibold p-5">
                    You didn't break the application, but we can't find what you are looking for.
                </p>
                <Button className="m-10 p-6" onClick={()=>navigate((-1))}>Go Back</Button>
            </div>

        </MainLayout>
    )
}

export default PageNotFound;
