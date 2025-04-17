// PermittingCurrentMonth.tsx
import { useState, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEnsureColors, useColor } from "./ColorContext";

type PieChartServerData = Record<string, number>;

type BarChartServerData = Record<string, number[]>;

type PermittingPieChartData = {
    engineer: string;
    projects: number;
};

type PermittingBarChartData = {
    engineer: string;
    avgTime: number;
};


function PermittingCurrentMonth({ responseData }: { responseData: { CURRENT_MONTH?: { PIECHARTDATA?: PieChartServerData, BARCHARTDATA?: BarChartServerData, VALUE?: string } } }) {
    const [pieChartData, setPieChartData] = useState<PermittingPieChartData[]>([]);
    const [barChartData, setBarChartData] = useState<PermittingBarChartData[]>([]);

    // console.log("pieChartData", pieChartData);
    // console.log("barChartData", barChartData);

    useEffect(() => {
        if (responseData?.CURRENT_MONTH && responseData.CURRENT_MONTH?.PIECHARTDATA && responseData.CURRENT_MONTH?.BARCHARTDATA) {
            const pieRaw: PieChartServerData = responseData.CURRENT_MONTH.PIECHARTDATA;
            const barRaw: BarChartServerData = responseData.CURRENT_MONTH.BARCHARTDATA;

            if (pieRaw) {
                const pieArray: PermittingPieChartData[] = Object.entries(pieRaw).map(([engineer, projects]) => ({
                    engineer,
                    projects
                }));
                setPieChartData(pieArray);
            }

            if (barRaw) {
                const barArray: PermittingBarChartData[] = Object.entries(barRaw).map(([engineer, times]) => {
                    const total = times.reduce((sum, t) => sum + t, 0);
                    const avgTime = times.length ? total / times.length : 0;
                    return { engineer, avgTime: parseFloat(avgTime.toFixed(2)) };
                });
                setBarChartData(barArray);
            }
        }
    }, [responseData]);

    const engineerNames = pieChartData.map((entry) => entry.engineer);
    useEnsureColors(engineerNames);

    if (
        !responseData ||
        !responseData.CURRENT_MONTH ||
        !responseData.CURRENT_MONTH.PIECHARTDATA
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
                {responseData.CURRENT_MONTH.VALUE}
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                {/* Pie Chart */}
                <div className="flex-col">
                    <p className="text-center p-2">Total Projects Breakdown</p>
                    <PieChart width={600} height={400} className="p-0 m-0">
                        <Pie
                            data={pieChartData}
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
                            {pieChartData.map((entry) => (
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
                    <BarChart className="m-0 p-0" data={barChartData} width={400} height={400}>
                        <XAxis dataKey="engineer" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="avgTime" name="Average Time" label={{ fill: "white" }}>
                            {barChartData.map((entry) => (
                                <Cell key={`bar-cell-${entry.engineer}`} fill={useColor(entry.engineer)} />
                            ))}
                        </Bar>
                    </BarChart>
                </div>

            </CardContent>
        </Card>
    );
}

export default PermittingCurrentMonth;

