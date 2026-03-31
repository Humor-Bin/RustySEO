// @ts-nocheck
"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useGlobalCrawlStore from "@/store/GlobalCrawlDataStore";
import { zhCN } from "@/app/utils/zhCN";

const chartConfig = {
  visitors: {
    label: zhCN.global.sidebar.charts.visitors,
  },
  chrome: {
    label: zhCN.global.sidebar.charts.html,
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: zhCN.global.sidebar.charts.safari,
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: zhCN.global.sidebar.charts.firefox,
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: zhCN.global.sidebar.charts.edge,
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: zhCN.global.sidebar.charts.other,
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

function H1MissingChart() {
  const {
    crawlData,
    javascript,
    css,
    domainCrawlLoading,
    issuesData,
    issuesView,
  } = useGlobalCrawlStore();
  const [sessionCrawls, setSessionCrawls] = useState<number>(0);
  const [totalCrawlPages, setTotalCrawlPages] = useState<number[]>([]);

  // Default values for optional data
  const totalPages = crawlData?.length || 0;

  const missingH1 = issuesData?.length;

  const chartData = [
    // { browser: "HTML", visitors: totalPages, fill: "hsl(210, 100%, 50%)" },
    {
      browser: zhCN.global.sidebar.charts.missing,
      visitors: missingH1 || 0,
      fill: "hsl(710, 100%, 60%)",
    },
    {
      browser: zhCN.global.sidebar.charts.contains,
      visitors: totalPages - missingH1 || 0,
      fill: "hsl(210, 100%, 70%)",
    },
  ];

  return (
    <Card className="flex flex-col dark:bg-gray-900 bg-slate-100 border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle>{zhCN.global.sidebar.charts.issuesFound}</CardTitle>
        <CardDescription>{issuesView}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
              className="text-white"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="dark:text-white"
                        aria-label={zhCN.global.sidebar.charts.totalPages}
                        role="text"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          style={{ color: "white" }}
                          className="text-3xl dark:fill-white text-white font-bold dark:text-white"
                        >
                          {missingH1?.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground dark:fill-white/50 dark:text-white"
                        >
                          {zhCN.global.sidebar.charts.h1Missing}
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-xs dark:text-white/50">
        <div className="leading-none text-muted-foreground">
          {zhCN.global.sidebar.charts.h1MissingFound.replace(
            "{count}",
            String(missingH1 || 0),
          )}
        </div>
        <div className="flex items-center gap-3 font-medium leading-none">
          {zhCN.global.sidebar.charts.fromTotalPagesAnalyzed.replace(
            "{count}",
            String(totalPages || 0),
          )}
        </div>
      </CardFooter>
    </Card>
  );
}

export default H1MissingChart;
