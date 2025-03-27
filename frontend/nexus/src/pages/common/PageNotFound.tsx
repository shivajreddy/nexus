import MainLayout from "@templates/MainLayout.tsx";
import { Button } from "@components/ui/button.tsx";
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


function PageNotFound() {
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="m-10 flex items-center justify-center w-full">
                <Card className="w-[60%] h-[60%] mx-2 flex flex-col">
                    <CardHeader className="bg-fuchsia-200 text-violet-800 p-4 w-full rounded-t-lg">
                        <CardTitle className="text-center">404</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-center flex-grow">
                        <p className="p-6">
                            You reached an unknown page
                        </p>
                        <p className="text-gray-500 p-6">
                            Please check if you there was a mistake in the link you are trying to access
                        </p>
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-center">
                        <Button className="m-10 p-6" onClick={() => navigate((-1))}>Go Back</Button>
                    </CardFooter>
                </Card>
            </div>
        </MainLayout>
    )
}

export default PageNotFound;
