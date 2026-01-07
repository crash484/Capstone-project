"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const demoData = [
  { date: "Jan 1", attendance: 92, predicted: 91 },
  { date: "Jan 2", attendance: 88, predicted: 87 },
  { date: "Jan 3", attendance: 85, predicted: 86 },
  { date: "Jan 4", attendance: 79, predicted: 80 },
  { date: "Jan 5", attendance: 75, predicted: 76 },
  { date: "Jan 6", attendance: 88, predicted: 87 },
  { date: "Jan 7", attendance: 91, predicted: 90 },
  { date: "Jan 8", attendance: 89, predicted: 89 },
  { date: "Jan 9", attendance: 86, predicted: 85 },
  { date: "Jan 10", attendance: 82, predicted: 83 },
];

export function AttendanceChart() {
  const [chartType, setChartType] = useState<"area" | "line" | "bar">("area");
  const [chartData, setChartData] = useState<typeof demoData>(demoData);

  useEffect(() => {
    let mounted = true;

    const fetchForecast = async () => {
      try {
        const res = await fetch('/api/ml/forecast');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;

        if (json?.data && Array.isArray(json.data)) {
          // eslint-disable-next-line 
          const mapped = json.data.map((it: any) => ({
            date: it.date,
            attendance: it.predicted_attendance,
            predicted: it.predicted_attendance,
          }));
          setChartData(mapped);
        }
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    };

    fetchForecast();
    return () => { mounted = false };
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              Actual vs AI-predicted attendance rates
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={chartType === "area" ? "default" : "outline"}
              onClick={() => setChartType("area")}
            >
              Area
            </Button>
            {/* <Button
              size="sm"
              variant={chartType === "line" ? "default" : "outline"}
              onClick={() => setChartType("area")}
            >
              Line
            </Button> */}
            <Button
              size="sm"
              variant={chartType === "bar" ? "default" : "outline"}
              onClick={() => setChartType("bar")}
            >
              Bar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorAttendance"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--color-chart-1))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--color-chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient
                    id="colorPredicted"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--color-chart-2))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--color-chart-2))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--color-border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--color-muted-foreground))"
                />
                <YAxis
                  stroke="hsl(var(--color-muted-foreground))"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--color-card))",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="attendance"
                  stroke="hsl(var(--color-chart-1))"
                  fillOpacity={1}
                  fill="url(#colorAttendance)"
                  name="Actual Attendance"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--color-chart-2))"
                  fillOpacity={1}
                  fill="url(#colorPredicted)"
                  name="AI Predicted"
                />
              </AreaChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--color-border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--color-muted-foreground))"
                />
                <YAxis
                  stroke="hsl(var(--color-muted-foreground))"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#000000",
                    border: "1px solid hsl(var(--color-border))",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="attendance"
                  fill="#22c55e"
                  name="Actual Attendance"
                />
                <Bar
                  dataKey="predicted"
                  fill="#3b82f6"
                  name="AI Predicted"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
