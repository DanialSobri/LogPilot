'use client'

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const generateData = (days: number) => {
  const data = []
  const now = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      logs: Math.floor(Math.random() * 2000) + 500,
      errors: Math.floor(Math.random() * 100)
    })
  }
  return data
}

const allData = generateData(90) // 3 months of data

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const date = new Date(label).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {date}
            </span>
            <span className="font-bold text-muted-foreground">
              {payload[0].value.toLocaleString()}
            </span>
            <span className="text-[0.70rem] font-bold uppercase text-muted-foreground">
              Total Logs
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-destructive">
              {payload[1].value.toLocaleString()}
            </span>
            <span className="text-[0.70rem] font-bold uppercase text-muted-foreground">
              Errors
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export function LogVolumeGraph() {
  const [activeTab, setActiveTab] = useState<"7d" | "30d" | "90d">("7d")

  const getFilteredData = () => {
    const days = activeTab === "7d" ? 7 : activeTab === "30d" ? 30 : 90
    return allData.slice(-days)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base font-normal">Log Volume Analytics</CardTitle>
        <Tabs defaultValue="7d" onValueChange={(value) => setActiveTab(value as "7d" | "30d" | "90d")} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="7d">Last 7 days</TabsTrigger>
            <TabsTrigger value="30d">Last 30 days</TabsTrigger>
            <TabsTrigger value="90d">Last 3 months</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={getFilteredData()}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="logs" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="errors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                horizontal={true}
                vertical={false}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.2}
              />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.5}
                fontSize={12}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })
                }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                stroke="hsl(var(--muted-foreground))"
                opacity={0.5}
                fontSize={12}
                tickFormatter={(value) => {
                  if (value >= 1000) {
                    return `${(value / 1000).toFixed(1)}k`
                  }
                  return value
                }}
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: "hsl(var(--muted-foreground))", strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="logs"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#logs)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="errors"
                stroke="hsl(var(--destructive))"
                fillOpacity={1}
                fill="url(#errors)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
