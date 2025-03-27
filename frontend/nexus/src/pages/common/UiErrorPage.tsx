import { Card, CardHeader, CardTitle, CardFooter, CardContent } from "@/components/ui/card";
import MainLayout from "@/templates/MainLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function UiErrorPage() {

    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="m-10 flex items-center justify-center w-full">
                <Card className="w-[60%] h-[60%] mx-2 flex flex-col">
                    <CardHeader className="bg-orange-800 text-white p-4 w-full rounded-t-lg">
                        <CardTitle className="text-center">UI FAILED TO RENDER</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-center flex-grow">
                        <p className="text-center text-lg p-4"> Contact the developer with link and screenshot of your browser's console.</p>
                        <p className="text-gray-500 p-6">
                            To open the console on 'Google Chrome' , you can use the keyboard shortcut Ctrl+Shift+J (Windows/Linux) or Cmd+Option+J (Mac),
                            or by navigating through the Chrome menu: click the three dots, select "More tools", and then "Developer Tools"
                        </p>
                        <p className="text-gray-500 p-6">
                            To open the Firefox console (also known as the Web Console or Developer Tools), you can either use the
                            keyboard shortcut Ctrl+Shift+J (Windows/Linux) or Cmd+Shift+J (macOS), or navigate through the menu by clicking on the three-line menu button,
                            then selecting "More Tools" and finally "Web Developer Tools"
                        </p>
                    </CardContent>
                    <CardFooter className="mt-auto flex justify-center">
                        <Button onClick={() => navigate(-1)}>
                            GO BACK
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </MainLayout>

    );
}

export default UiErrorPage;
