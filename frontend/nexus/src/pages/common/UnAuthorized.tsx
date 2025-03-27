import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import MainLayout from "@/templates/MainLayout";
import { useNavigate } from "react-router-dom"

function UnAuthorized() {

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="m-10 flex items-center justify-center h-full w-full">
                <Card className="w-[60%] h-[80%] mx-2 flex flex-col">
                    <CardHeader className="bg-red-500 text-white p-4 w-full rounded-t-lg">
                        <CardTitle className="text-center">UNAUTHORIZED</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-center flex-grow">
                        <p className="text-center text-lg p-4">Looks like you tried to access a link/page that your account doesn't have access to.</p>
                        <p className="text-center text-lg p-4 text-gray-500">If you believe this is a mistake, please contact the developer.</p>
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-center">
                        <Button onClick={() => navigate(-1)}>
                            GO BACK
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </MainLayout>
    )
}

export default UnAuthorized
