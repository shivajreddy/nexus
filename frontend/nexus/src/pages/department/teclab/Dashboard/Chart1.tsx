import { useState, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "@/services/axios";


/*
const chartData = [
  { engineer: "Alice", projects: 12 },

  { engineer: "Bob", projects: 8 },
  { engineer: "Charlie", projects: 15 },
  { engineer: "David", projects: 10 },
  { engineer: "Eve", projects: 7 },
];
*/

function Chart1() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('/department/teclab/dashboard/engineer-data');
        console.log("response = ", response);
        console.log("response.data = ", response.data);
        const data = await response.data;
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


