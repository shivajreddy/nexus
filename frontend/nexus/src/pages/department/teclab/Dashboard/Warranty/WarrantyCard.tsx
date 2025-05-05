import { Card, CardContent, CardHeader } from "@/components/ui/card";

function WarrantyCard() {

    // Make API call to /department/warranty/dashboard/test
    const url = "/department/warranty/dashboard/test";
    console.log("calling", url);

    return (
        <Card>
            <CardHeader>
                <p className="text-center text-xl">Warranty Dashboard : 1</p>
            </CardHeader>
            <CardContent>
                <p>Bar chart</p>
                <p>Pie chart</p>
            </CardContent>
        </Card>
    )
}

export default WarrantyCard
