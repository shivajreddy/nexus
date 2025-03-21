"use client"
import { ProgressDemo } from "./Progress";
import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface MetricBreakdown {
  MIN: number;
  MAX: number;
  VAL: number;
}

interface Metrics {
  total: number;
  breakdown: {
    Drafting: MetricBreakdown;
    Engineering: MetricBreakdown;
    Plat: MetricBreakdown;
    Permitting: MetricBreakdown;
    "BBP Posted": MetricBreakdown;
  };
}

function Ticker() {
  const [previous_month_metrics, setPreviousMonthMetrics] = useState<Metrics | null>(null);
  const [current_month_metrics, setCurrentMonthMetrics] = useState<Metrics | null>(null);
  const [current_year_metrics, setCurrentYearMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  const axios = useAxiosPrivate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/department/teclab/dashboard/ticker-data");
        console.log("/ticker-data::response.data", response.data);
        setPreviousMonthMetrics(response.data["PREVIOUS MONTH"]);
        setCurrentMonthMetrics(response.data["CURRENT MONTH"]);
        setCurrentYearMetrics(response.data["CURRENT YEAR"]);
      } catch (error) {
        console.error("Error fetching metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axios]);

  const renderMetrics = (title: string, metrics: Metrics | null) => (
    <>
      <div className="flex justify-center items-center">
        <p className="px-8">{title}</p>
        <p>Projects: {metrics?.total ?? "N/A"}</p>
      </div>
      <div className="flex">
        {loading ? (
          <p>Loading metrics...</p>
        ) : (
          metrics &&
          Object.entries(metrics.breakdown).map(([key, data]) => (
            <ProgressDemo
              key={key}
              title={key}
              min={data.MIN}
              max={data.MAX}
              val={data.VAL}
            />
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="">
      <div className="bg-default-bg1 my-2 p-2">
        {renderMetrics("Previous Month", previous_month_metrics)}
      </div>

      <div className="bg-lime-100 my-2 p-2">
        {renderMetrics("Current Month", current_month_metrics)}
      </div>

      <div className="bg-default-bg1 my-2 p-2">
        {renderMetrics("Current Year", current_year_metrics)}
      </div>
    </div>
  );
}

export default Ticker;

