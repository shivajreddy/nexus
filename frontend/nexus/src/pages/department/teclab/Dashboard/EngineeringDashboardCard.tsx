/*
*/
import { useState, useEffect } from "react";
import { Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend, BarChart, Text, Label } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";


type ChartData = {
    engineer: string;
    projects: number;
};


type EngineerData = {
    engineerName: string;
    avgTime: number;
    totalProjects: number;
    colorHexCode: string;
};

function EngineeringDashboardCard() {
    // Color palette for pie segments
    const COLORS = ['#2364AA', '#5c9ead', '#DFAF01', '#5D576B', '#703880', '#dbeafe', '#eff6ff', '#1e40af', '#1d4ed8', '#2563eb'];

    const [subChart1Data, setSubChart1Data] = useState<ChartData[]>([]);
    const [chartValue, setChartValue] = useState<string>("");
    const axios = useAxiosPrivate();
    // console.log("subChard1Data", subChard1Data);
    useEffect(() => {
        async function fetchData() {
            // console.log("trying to fetch");
            try {
                const response = await axios.get("/department/teclab/dashboard/engineer-dashboard-data");
                console.log("response::", response);
                const rawData = response.data;
                console.log("rawData = ", rawData);
                const previousMonthRawData = rawData["PREVIOUS-MONTH"]["DATA"];
                console.log("previousMonthRawData = ", previousMonthRawData);

                const data: ChartData[] = Object.entries(previousMonthRawData).map(([engineer, projects]) => {
                    const totalProjects = Object.values(projects).reduce((sum, count) => sum + count, 0);
                    return {
                        engineer,
                        projects: totalProjects,
                    };
                });
                // Sort by engineer name (alphabetically)
                data.sort((a, b) => a.engineer.localeCompare(b.engineer));
                console.log('sorted data', data);
                setSubChart1Data(data);
                console.log('rawData["PREVIOUS-MONTH"]', rawData["PREVIOUS-MONTH"]);
                setChartValue(rawData["PREVIOUS-MONTH"]["VALUE"])
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, []);

    const [subChard2Data, setSubChart2Data] = useState<EngineerData[]>([]);
    // console.log("subChard2Data", subChard2Data);
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get("/department/teclab/dashboard/engineer-data-2");
                // console.log("response = ", response);
                // console.log("response.data = ", response.data);

                // Process the data to calculate average time and total projects
                const processedData: EngineerData[] = Object.entries(response.data).map(([engineer, timesArray]) => {
                    // Cast timesArray to number array
                    const times = timesArray as number[];

                    // Calculate average time (sum of all times divided by number of times)
                    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;

                    // Count total projects (length of the array)
                    const totalProjects = times.length;

                    return {
                        engineer,
                        avgTime: parseFloat(avgTime.toFixed(1)), // Round to 1 decimal place
                        totalProjects,
                        colorHexCode: ""
                    };
                });

                // Sort by engineer name (alphabetically)
                processedData.sort((a, b) => a.engineerName.localeCompare(b.engineerName));

                // Now that they are sorted go over the sorted processedData and set the colorHexCode
                processedData.map((_, idx) => (
                    processedData[idx].colorHexCode = COLORS[idx % COLORS.length]
                ))

                setSubChart2Data(processedData);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, []);

    return (
        <Card className="w-max mx-4">
            <CardHeader className="text-center text-xl p-2">{chartValue}</CardHeader>
            <CardContent className="flex items-center justify-center">

                {/* Sub-Chart 1 */}
                <PieChart width={600} height={400} className="p-0 m-0">
                    <Pie
                        data={subChart1Data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ engineer, value, percent }) =>
                            `${engineer}:${value} (${(percent * 100).toFixed(0)}%)`
                        }
                        // label={({ engineer, percent }) => `${engineer}-${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        innerRadius={100}
                        fill="#8884d8"
                        dataKey="projects"
                        nameKey="engineer"
                        legendType="square"
                    >
                        {subChart1Data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, _, props) => [`${value} projects`, props.payload.engineer]} />
                    <Legend />
                    {/* <Label value="hi" /> */}
                </PieChart>

                {/* Sub-Chart 2 */}
                <BarChart className="m-0 p-0" data={subChard2Data} width={400} height={400}>
                    <XAxis dataKey="engineer" />
                    <YAxis />
                    {/* <Tooltip /> */}
                    {/* <Legend /> */}
                    {/* <Bar dataKey="avgTime" name="Average Time" fill={} /> */}
                    <Bar dataKey="avgTime" name="Average Time" label={{ fill: 'white' }}>
                        {subChard2Data.map((entry, index) => (
                            <Cell key={`bar-cell-${index}`} fill={entry.colorHexCode} />
                        ))}
                    </Bar>
                </BarChart>

            </CardContent>
        </Card>
    );
}

export default EngineeringDashboardCard;

