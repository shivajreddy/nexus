import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Rectangle } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

type EngineerData = {
  engineer: string;
  avgTime: number;
  totalProjects: number;
};

function County_2() {
  const [chartData, setChartData] = useState<EngineerData[]>([]);
  const axios = useAxiosPrivate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/department/teclab/dashboard/county-data-2");
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
            totalProjects
          };
        });

        setChartData(processedData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <Card className="w-[650px] h-[520px] m-2 p-2">
      <CardHeader className="text-center">Counties Cycle Time</CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="engineer"
              label={{ value: "Engineer", position: "insideBottom", dy: 20 }}
            />
            <YAxis
              yAxisId="left"
              label={{ value: "Avg. Time (days)", angle: -90, position: "insideLeft", dx: -10, dy: 80 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{ value: "Total Projects", angle: -90, position: "insideRight", dx: 10, dy: -40 }}
            />
            <Tooltip formatter={(value, name) => {
              if (name === "avgTime") return [`${value} days`, "Average Time"];
              if (name === "totalProjects") return [value, "Total Projects"];
              return [value, name];
            }} />
            <Legend wrapperStyle={{ bottom: 0, left: 25, position: 'absolute' }} />
            <Bar
              dataKey="avgTime"
              name="Average Time"
              fill="#8884d8"
              yAxisId="left"
            // activeBar={<Rectangle fill="pink" stroke="purple" />}
            />
            <Bar
              dataKey="totalProjects"
              name="Total Projects"
              fill="#82ca9d"
              yAxisId="right"
            // activeBar={<Rectangle fill="gold" stroke="green" />}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default County_2;


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

function Chart3() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const axios = useAxiosPrivate();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/department/teclab/dashboard/engineer-data-2");
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
      <CardHeader className="text-center">Avg. Time Taken by Engineer</CardHeader>
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

export default Chart3;
*/
