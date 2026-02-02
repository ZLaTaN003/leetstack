
import { Pie, PieChart } from "recharts"

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

export const description = "A simple pie chart"



const chartConfig = {
  solved: {
    label: "Problems Solved",
  },
  easy: {
    label: "Easy",
    color: "var(--chart-1)",
  },
  medium: {
    label: "Medium",
    color: "var(--chart-2)",
  },
  hard: {
    label: "Hard",
    color: "var(--chart-3)",
  },

} 

export function ChartPieSimple({chartData,totalsolved}) {
   
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Problems by Difficulty</CardTitle>
        <CardDescription>LeetCode Problems Solved by Difficulty</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="solved" nameKey="difficulty" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
            Total Number of Problems Solved <span className="font-bold">{totalsolved}</span>
        </div>
       
      </CardFooter>
    </Card>
  )
}
