"use client"
import { ProgressDemo } from "./Progress";
import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

interface MetricBreakdown {
    USER_MIN: number;
    USER_MAX: number;
    MIN: number;
    MAX: number;
    VAL: number;
    COUNT: number;
}

interface Metrics {
    title: string,
    total: number;
    breakdown: {
        "Drafting": MetricBreakdown;
        "Engineering": MetricBreakdown;
        "Plat": MetricBreakdown;
        "Permitting": MetricBreakdown;
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
                // console.log("/ticker-data::response.data", response.data);
                setPreviousMonthMetrics(response.data["PREVIOUS MONTH"]);
                setCurrentMonthMetrics(response.data["CURRENT MONTH"]);
                setCurrentYearMetrics(response.data["CURRENT YEAR"]);
            } catch (error) {
                // console.error("Error fetching metrics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [axios]);

    // console.log("previousmonth renderMetrics:", previous_month_metrics);
    // console.log("TESTING:", previous_month_metrics?.breakdown.Drafting.MIN);
    const renderMetrics = (metrics: Metrics | null) => (
        <>
            <div className="flex justify-center items-center">
                <p className="px-8">{metrics?.title ?? "-"}</p>
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
                            count={data.COUNT}
                            user_min={data.USER_MIN}
                            user_max={data.USER_MAX}
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
        <div>
            <div className="bg-default-bg1 my-2 p-2 mx-4 px-8">
                {renderMetrics(previous_month_metrics)}
            </div>

            <div className="bg-white my-2 p-2 mx-4 px-8">
                {renderMetrics(current_month_metrics)}
            </div>

            <div className="bg-default-bg1 my-2 p-2 mx-4 px-8">
                {renderMetrics(current_year_metrics)}
            </div>
        </div>
    );
}

export default Ticker;

