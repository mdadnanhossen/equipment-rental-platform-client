
"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "cn";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatBDT } from "@/components/dashboard/payments/format";
import type { PaymentRecord } from "@/components/dashboard/payments/types";

type RangeKey = "6m" | "12m";

interface RevenuePoint {
  month: string;
  revenue: number;
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "#16A37A",
  },
} satisfies ChartConfig;

interface RevenueChartProps {
  className?: string;
  records?: PaymentRecord[];
}

export function RevenueChart({
  className,
  records = [],
}: RevenueChartProps) {
  const [range, setRange] = useState<RangeKey>("6m");

  const data = useMemo<RevenuePoint[]>(() => {
    const monthCount = range === "6m" ? 6 : 12;
    const now = new Date();

    const months = Array.from(
      { length: monthCount },
      (_, index) => {
        const date = new Date(
          now.getFullYear(),
          now.getMonth() - (monthCount - 1 - index),
          1,
        );

        const year = date.getFullYear();
        const monthNumber = String(
          date.getMonth() + 1,
        ).padStart(2, "0");

        return {
          key: `${year}-${monthNumber}`,
          month: date.toLocaleString("en-US", {
            month: "short",
            year: "2-digit",
          }),
          revenue: 0,
        };
      },
    );

    const revenueMap = new Map(
      months.map((item) => [item.key, item]),
    );

    records.forEach((payment) => {
      if (
        payment.status !== "paid" ||
        !payment.paymentDate
      ) {
        return;
      }

      const paidDate = new Date(payment.paymentDate);

      if (Number.isNaN(paidDate.getTime())) {
        return;
      }

      const amount = Number(payment.amount);

      if (!Number.isFinite(amount) || amount < 0) {
        return;
      }

      const year = paidDate.getFullYear();
      const monthNumber = String(
        paidDate.getMonth() + 1,
      ).padStart(2, "0");

      const key = `${year}-${monthNumber}`;
      const monthRecord = revenueMap.get(key);

      if (monthRecord) {
        monthRecord.revenue += amount;
      }
    });

    return months.map(({ month, revenue }) => ({
      month,
      revenue,
    }));
  }, [records, range]);

  const total = useMemo(
    () =>
      data.reduce(
        (sum, point) => sum + point.revenue,
        0,
      ),
    [data],
  );

  const hasRevenue = data.some(
    (point) => point.revenue > 0,
  );

  return (
    <section
      className={cn(
        "flex flex-col rounded-xl border bg-card p-5 shadow-[0_1px_2px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Revenue analytics
          </h2>

          <p className="mt-0.5 text-sm text-muted-foreground">
            Monthly successful payment volume.
          </p>
        </div>

        <Tabs
          value={range}
          onValueChange={(value) =>
            setRange(value as RangeKey)
          }
        >
          <TabsList>
            <TabsTrigger value="6m">
              6 months
            </TabsTrigger>

            <TabsTrigger value="12m">
              12 months
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <span
            aria-hidden="true"
            className="size-2.5 rounded-full bg-[#16A37A]"
          />
          Revenue
        </span>

        <span className="text-muted-foreground">
          Period total{" "}
          <span className="font-semibold text-foreground tabular-nums">
            {formatBDT(total)}
          </span>
        </span>
      </div>

      {hasRevenue ? (
        <ChartContainer
          config={chartConfig}
          className="mt-4 aspect-auto h-[260px] w-full"
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 12,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="rentoraRevenueFill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#16A37A"
                  stopOpacity={0.25}
                />

                <stop
                  offset="100%"
                  stopColor="#16A37A"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              className="stroke-border"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              width={54}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                `৳${Math.round(Number(value) / 1000)}k`
              }
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <div className="flex w-full items-center justify-between gap-6">
                      <span className="text-muted-foreground">
                        Revenue
                      </span>

                      <span className="font-medium tabular-nums">
                        {formatBDT(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke={chartConfig.revenue.color}
              strokeWidth={2.5}
              fill="url(#rentoraRevenueFill)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ChartContainer>
      ) : (
        <div className="mt-4 flex h-[260px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
          <p className="text-sm font-medium">
            No revenue data available
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Successful payments will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
