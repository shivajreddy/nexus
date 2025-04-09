import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { log } from "console";

type ChartData = {
    engineer: string;
    projects: number;
};

function Engineer_1() {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const axios = useAxiosPrivate();
    // console.log("Hi");
    // console.log("chartData", chartData);

    // Color palette for pie segments
    const COLORS = ['#2364AA', '#5c9ead', '#DFAF01', '#5D576B', '#703880', '#dbeafe', '#eff6ff', '#1e40af', '#1d4ed8', '#2563eb'];

    useEffect(() => {
        async function fetchData() {
            // console.log("trying to fetch");
            try {
                const response = await axios.get("/department/teclab/dashboard/engineer-data");
                // console.log("response = ", response);
                // console.log("response.data = ", response.data);
                // Convert object to array and assert type
                const data: ChartData[] = Object.entries(response.data).map(([engineer, projects]) => ({
                    engineer,
                    projects: projects as number, // Type assertion
                }));
                // Sort by engineer name (alphabetically)
                data.sort((a, b) => a.engineer.localeCompare(b.engineer));
                setChartData(data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <div className="flex items-center justify-center border-red">
            <Card className="w-[650px] h-[420px] m-2 p-2 flex-shrink-0 ">
                {/* <Card className="w-[650px] h-[520px] m-2 p-2 flex flex-col items-center justify-center overflow-auto"> */}
                <CardHeader className="text-center">Projects Handled by Engineers</CardHeader>
                <CardContent className="flex flex-col items-center p-0 m-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={true}
                                label={({ engineer, percent }) => `${engineer} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="projects"
                                nameKey="engineer"
                                legendType="square"
                            >
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, _, props) => [`${value} projects`, props.payload.engineer]} />
                            {/* <Legend /> */}
                        </PieChart>
                    </ResponsiveContainer>
                    <p className="text-center m-0 pt-10">Total Projects : {chartData.reduce((sum, item) => sum + item.projects, 0)}</p>
                </CardContent>
            </Card>
        </div>
    );
}

export default Engineer_1;

