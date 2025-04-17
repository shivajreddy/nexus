import { useState, useEffect } from "react";
import { Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend, BarChart, Text, Label } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";


type ChartData = {
    engineer: string;
    projects: number;
};


type EngineerData = {
    engineer: string;
    avgTime: number;
    totalProjects: number;
    colorHexCode: string;
};


function DraftingCurrentYear_backup({ responseData }) {

    // console.log('responseData in child', responseData);
    // Color palette for pie segments
    const COLORS = ['#2364AA', '#5c9ead', '#DFAF01', '#5D576B', '#703880', '#dbeafe', '#eff6ff', '#1e40af', '#1d4ed8', '#2563eb'];

    const [chartData, setChartData] = useState<ChartData[]>([]);
    useEffect(() => {
        // Assuming responseData is available in your component scope
        if (responseData && responseData["CURRENT_YEAR"] && responseData["CURRENT_YEAR"]["PIECHARTDATA"]) {
            // Transform the nested object structure into a flat array
            const engineeringData = responseData["CURRENT_YEAR"]["PIECHARTDATA"];

            // Create data with departments and their total projects
            const departmentData: ChartData[] = Object.entries(engineeringData).map(([department, engineers]) => {
                // Sum up all projects for this department
                const totalProjects = Object.values(engineers as Record<string, number>)
                    .reduce((sum, count) => sum + count, 0);

                return {
                    engineer: department,
                    projects: totalProjects
                };
            });

            // Sort by department name if needed
            departmentData.sort((a, b) => a.engineer.localeCompare(b.engineer));

            setChartData(departmentData);
        }
    }, [responseData]);

    const [subChard2Data, setSubChart2Data] = useState<EngineerData[]>([]);
    // console.log("subChard2Data", subChard2Data);
    useEffect(() => {
        async function fetchData() {
            try {
                // console.log("data::", responseData["CURRENT_YEAR"]["BARCHARTDATA"])
                const data = responseData["CURRENT_YEAR"]["BARCHARTDATA"];

                // Process the data to calculate average time and total projects
                const processedData: EngineerData[] = Object.entries(data).map(([engineer, timesArray]) => {

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
                processedData.sort((a, b) => a.engineer.localeCompare(b.engineer));

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
    }, [responseData]);


    // Check if data is available before rendering
    if (!responseData || !responseData["CURRENT_YEAR"] || !responseData["CURRENT_YEAR"]["PIECHARTDATA"]) {
        return (
            <Card className="w-max mx-4">
                <CardContent className="flex items-center justify-center">
                    <p>Loading data...</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-max mx-4">
            <CardHeader className="text-center text-xl p-2"> {responseData["CURRENT_YEAR"]["VALUE"]} </CardHeader>
            <CardContent className="flex items-center justify-center">

                {/* Sub-Chart 1 */}
                <PieChart width={600} height={400} className="p-0 m-0">
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ engineer, value, percent }) =>
                            `${engineer}:${value} (${(percent * 100).toFixed(0)}%)`
                        }
                        outerRadius={150}
                        innerRadius={100}
                        fill="#8884d8"
                        dataKey="projects"
                        nameKey="engineer"
                        legendType="square"
                    >
                        {Object.entries(responseData["CURRENT_YEAR"]["PIECHARTDATA"]).map(([key, value], index) => (
                            <Cell key={`cell-${key}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, _, props) => [`${value} projects`, props.payload.engineer]} />
                    <Legend />
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


export default DraftingCurrentYear_backup;

