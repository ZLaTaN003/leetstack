import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useRef} from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"




const chartConfig = {
  submissions: {
    label: "Submissions",
    color: "var(--chart-1)",
  },
}


export function ChartLineDefault({ session }) {
  const username = session?.user?.user_metadata?.leetcodename ?? null;
  const hasFetched = useRef(false);


  function buildChartData(labels, values) {
    return labels.map((label, index) => ({
      day: label,
      submissions: values[index],
    }));
  }

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!session || !username) return;

    if (hasFetched.current) {
      console.log("Already fetched chart data");
      return;
    }
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/getlatestsubmissions?username=${username}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const data = await response.json();
        setChartData(buildChartData(data.labels, data.values));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [session, username]);

  return (
    <Card className="bg-[#18181b] border border-[#27272a] text-[#fafafa] ">
      <CardHeader>
        <CardTitle>Last 7 Days LeetCode Progress</CardTitle>
        <CardDescription>Lastest Activity</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={chartData}
            >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              interval={0}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <Line
              type="monotone"
              dataKey="submissions"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
