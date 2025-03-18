/*
const chartData = [
  { engineer: "Alice", projects: 12 },

  { engineer: "Bob", projects: 8 },
  { engineer: "Charlie", projects: 15 },
  { engineer: "David", projects: 10 },
  { engineer: "Eve", projects: 7 },
];
*/
/*
import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type ChartData = {
  engineer: string;
  projects: number;
};

function Chart1() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const axios = useAxiosPrivate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/department/teclab/dashboard/engineer-data");
        console.log("response = ", response);
        console.log("response.data = ", response.data);

        // Convert object to array and assert type
        const data: ChartData[] = Object.entries(response.data).map(([engineer, projects]) => ({
          engineer,
          projects: projects as number, // Type assertion
        }));

        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <Card className="w-[650px] h-[520px] m-2 p-2">
      <CardHeader className="text-center">Projects Handled by Engineers</CardHeader>
      <CardContent>
        <BarChart className="min-h-[220px] w-full p-0" width={600} height={400} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="engineer"
            label={{ value: "Engineer", position: "insideBottom", dy: 24 }}
          />
          <YAxis
            label={{ value: "Total Projects", angle: -90, position: "insideLeft", dy: 40, dx: 10 }}
          />
          <Tooltip />
          <Bar dataKey="projects" fill="#2563eb" radius={4} barSize={50} />
        </BarChart>
      </CardContent>
    </Card>
  );
}

export default Chart1;
*/
import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type ChartData = {
  engineer: string;
  projects: number;
};

function Engineer_1() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const axios = useAxiosPrivate();

  // Color palette for pie segments
  const COLORS = ['#2563eb', '#059669', '#e11d48', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff', '#1e40af', '#1d4ed8', '#2563eb'];

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/department/teclab/dashboard/engineer-data");
        console.log("response = ", response);
        console.log("response.data = ", response.data);
        // Convert object to array and assert type
        const data: ChartData[] = Object.entries(response.data).map(([engineer, projects]) => ({
          engineer,
          projects: projects as number, // Type assertion
        }));
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="w-[650px] h-[520px] m-2 p-2">
      <CardHeader className="text-center">Projects Handled by Engineers</CardHeader>
      <CardContent className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={400}>
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
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value, name, props) => [`${value} projects`, props.payload.engineer]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default Engineer_1;

