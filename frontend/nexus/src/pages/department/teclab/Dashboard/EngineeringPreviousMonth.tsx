import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend, Label } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEnsureColors, useColor } from "./ColorContext";

type ChartData = {
    engineer: string;
    projects: number;
};

type EngineerData = {
    engineer: string;
    avgTime: number;
    totalProjects: number;
};


function EngineeringPreviousMonth({ responseData }: { responseData: any }) {
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [subChart2Data, setSubChart2Data] = useState<EngineerData[]>([]);

    useEffect(() => {
        if (
            responseData &&
            responseData.PREVIOUS_MONTH &&
            responseData.PREVIOUS_MONTH.PIECHARTDATA
        ) {
            const engineeringData = responseData.PREVIOUS_MONTH.PIECHARTDATA;

            const departmentData: ChartData[] = Object.entries(engineeringData).map(
                ([department, engineers]) => {
                    const totalProjects = Object.values(engineers as Record<string, number>).reduce(
                        (sum, count) => sum + count,
                        0
                    );

                    return {
                        engineer: department,
                        projects: totalProjects,
                    };
                }
            );

            departmentData.sort((a, b) => a.engineer.localeCompare(b.engineer));
            setChartData(departmentData);
        }

        if (
            responseData &&
            responseData.PREVIOUS_MONTH &&
            responseData.PREVIOUS_MONTH.BARCHARTDATA
        ) {
            const data = responseData.PREVIOUS_MONTH.BARCHARTDATA;

            const processedData: EngineerData[] = Object.entries(data).map(([engineer, timesArray]) => {
                const times = timesArray as number[];
                const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
                const totalProjects = times.length;

                return {
                    engineer,
                    avgTime: parseFloat(avgTime.toFixed(1)),
                    totalProjects,
                };
            });

            processedData.sort((a, b) => a.engineer.localeCompare(b.engineer));
            setSubChart2Data(processedData);
        }
    }, [responseData]);

    const engineerNames = chartData.map((entry) => entry.engineer);
    useEnsureColors(engineerNames);

    if (
        !responseData ||
        !responseData.PREVIOUS_MONTH ||
        !responseData.PREVIOUS_MONTH.PIECHARTDATA
    ) {
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
            <CardHeader className="text-center text-xl p-2 text-white bg-slate-600 rounded-t-md">
                {responseData.PREVIOUS_MONTH.VALUE}
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                {/* Pie Chart */}
                <div className="flex-col">
                    <p className="text-center p-2">Total Projects Breakdown</p>
                    <PieChart width={600} height={400} className="p-0 m-0">
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ engineer, projects, percent }) =>
                                `${engineer}:${projects} (${(percent * 100).toFixed(0)}%)`
                            }
                            outerRadius={110}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="projects"
                            nameKey="engineer"
                            legendType="square"
                        >
                            {chartData.map((entry) => (
                                <Cell key={`cell-${entry.engineer}`} fill={useColor(entry.engineer)} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value, _, props) => [`${value} projects`, props.payload.engineer]} />
                        <Legend />
                    </PieChart>
                </div>

                {/* Bar Chart */}
                <div className="flex-col">
                    <p className="text-center p-2">Average Cycle Times</p>
                    <BarChart className="m-0 p-0" data={subChart2Data} width={400} height={400}>
                        <XAxis dataKey="engineer" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgTime" name="Average Time" label={{ fill: "white" }}>
                            {subChart2Data.map((entry) => (
                                <Cell key={`bar-cell-${entry.engineer}`} fill={useColor(entry.engineer)} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>

            </CardContent>
        </Card>
    );
}

export default EngineeringPreviousMonth;

