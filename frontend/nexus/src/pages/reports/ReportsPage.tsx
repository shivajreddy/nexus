import MainLayout from "@templates/MainLayout.tsx";
import { useState } from "react";
import { Button } from "@components/ui/button.tsx";
import { BASE_URL } from "@/services/api";
import { selectAuthState } from "@/features/auth/authSlice";
import { useAppSelector } from "@/redux/hooks";
import { MdDownload } from "react-icons/md";
import { BsFileEarmarkSpreadsheet } from "react-icons/bs";

// ── Types ──────────────────────────────────────────────────────────────────────

type ReportType = "current-week" | "past-week" | "year-2025" | "year-2026" | "month-2026";

interface DownloadState {
    status: "idle" | "loading" | "success" | "error";
    message: string;
}

const MONTH_NAMES: Record<number, string> = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function buildEndpoint(reportType: ReportType, weeksAgo: number, month: number): string | null {
    switch (reportType) {
        case "current-week":
            return `/dev/analysis/current-week/report/excel`;
        case "past-week":
            if (weeksAgo < 1) return null;
            return `/dev/analysis/past-week/${weeksAgo}/report/excel`;
        case "year-2025":
            return `/dev/analysis/2025/report/excel`;
        case "year-2026":
            return `/dev/analysis/2026/report/excel`;
        case "month-2026":
            if (month < 1 || month > 12) return null;
            return `/dev/analysis/2026/${month}/report/excel`;
        default:
            return null;
    }
}

function buildFilename(reportType: ReportType, weeksAgo: number, month: number): string {
    switch (reportType) {
        case "current-week":
            return `nexus-report-current-week.xlsx`;
        case "past-week":
            return `nexus-report-${weeksAgo}week(s)-ago.xlsx`;
        case "year-2025":
            return `nexus-report-2025.xlsx`;
        case "year-2026":
            return `nexus-report-2026.xlsx`;
        case "month-2026":
            return `nexus-report-2026-${MONTH_NAMES[month] ?? month}.xlsx`;
        default:
            return `nexus-report.xlsx`;
    }
}

// ── Section card ───────────────────────────────────────────────────────────────

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-border bg-default-bg1 p-6 mb-4">
            <h2 className="text-base font-semibold mb-4 text-default-fg1">{title}</h2>
            {children}
        </div>
    );
}

// ── Status badge ───────────────────────────────────────────────────────────────

function StatusBadge({ state }: { state: DownloadState }) {
    if (state.status === "idle") return null;

    const styles: Record<string, string> = {
        loading: "bg-yellow-100 text-yellow-800 border-yellow-300",
        success: "bg-green-100 text-green-800 border-green-300",
        error: "bg-red-100 text-red-800 border-red-300",
    };

    return (
        <p className={`mt-2 text-sm px-3 py-1 rounded border inline-block ${styles[state.status]}`}>
            {state.message}
        </p>
    );
}

// ── Main page ──────────────────────────────────────────────────────────────────

function ReportsPage() {
    const authState = useAppSelector(selectAuthState);

    // Form state
    const [reportType, setReportType] = useState<ReportType>("current-week");
    const [weeksAgo, setWeeksAgo] = useState<number>(1);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    // Download state
    const [downloadState, setDownloadState] = useState<DownloadState>({ status: "idle", message: "" });

    async function handleDownload() {
        const endpoint = buildEndpoint(reportType, weeksAgo, month);
        if (!endpoint) {
            setDownloadState({ status: "error", message: "Invalid report parameters." });
            return;
        }

        setDownloadState({ status: "loading", message: "Generating report..." });

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authState.accessToken}`,
                },
                credentials: "include",
            });

            if (!response.ok) {
                const text = await response.text();
                setDownloadState({ status: "error", message: `Error ${response.status}: ${text}` });
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = buildFilename(reportType, weeksAgo, month);
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);

            setDownloadState({ status: "success", message: "Report downloaded successfully." });
        } catch (err) {
            setDownloadState({ status: "error", message: "Network error. Could not reach the server." });
        }
    }

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <MainLayout>
            <div className="p-6 max-w-2xl mx-auto">

                {/* Page header */}
                <div className="flex items-center gap-3 mb-6">
                    <BsFileEarmarkSpreadsheet size="1.8rem" className="text-default-fg1" />
                    <div>
                        <h1 className="text-2xl font-bold text-default-fg1">Generate Report</h1>
                        <p className="text-sm text-default-fg2 mt-0.5">
                            Download analysis reports as Excel (.xlsx) files
                        </p>
                    </div>
                </div>

                {/* Report type selector */}
                <SectionCard title="Report Period">
                    <div className="flex flex-col gap-3">

                        {/* Current week */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="reportType"
                                value="current-week"
                                checked={reportType === "current-week"}
                                onChange={() => setReportType("current-week")}
                                className="accent-default-fg1"
                            />
                            <span className="font-medium">Current Week</span>
                            <span className="text-sm text-default-fg2">Monday – Sunday of this week</span>
                        </label>

                        {/* Past week */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="reportType"
                                value="past-week"
                                checked={reportType === "past-week"}
                                onChange={() => setReportType("past-week")}
                                className="accent-default-fg1 mt-1"
                            />
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">Past Week</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-default-fg2">Weeks ago:</span>
                                    <input
                                        type="number"
                                        min={1}
                                        max={52}
                                        value={weeksAgo}
                                        disabled={reportType !== "past-week"}
                                        onChange={e => setWeeksAgo(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1 disabled:opacity-40"
                                    />
                                </div>
                            </div>
                        </label>

                        {/* Full year 2025 */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="reportType"
                                value="year-2025"
                                checked={reportType === "year-2025"}
                                onChange={() => setReportType("year-2025")}
                                className="accent-default-fg1"
                            />
                            <span className="font-medium">Full Year 2025</span>
                            <span className="text-sm text-default-fg2">All projects with activity in 2025</span>
                        </label>

                        {/* Full year 2026 */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="reportType"
                                value="year-2026"
                                checked={reportType === "year-2026"}
                                onChange={() => setReportType("year-2026")}
                                className="accent-default-fg1"
                            />
                            <span className="font-medium">Full Year 2026</span>
                            <span className="text-sm text-default-fg2">All projects with activity in 2026</span>
                        </label>

                        {/* Monthly 2026 */}
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="radio"
                                name="reportType"
                                value="month-2026"
                                checked={reportType === "month-2026"}
                                onChange={() => setReportType("month-2026")}
                                className="accent-default-fg1 mt-1"
                            />
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">Monthly — 2026</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-default-fg2">Month:</span>
                                    <select
                                        value={month}
                                        disabled={reportType !== "month-2026"}
                                        onChange={e => setMonth(parseInt(e.target.value))}
                                        className="border border-border rounded px-2 py-1 text-sm bg-default-bg2 text-default-fg1 disabled:opacity-40"
                                    >
                                        {Object.entries(MONTH_NAMES).map(([num, name]) => (
                                            <option key={num} value={num}>{name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </label>

                    </div>
                </SectionCard>

                {/* Report contents info */}
                <SectionCard title="Report Contents">
                    <p className="text-sm text-default-fg2 leading-relaxed">
                        Each report is an Excel workbook with the following sheets:
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-default-fg2">
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">Summary</b> — total counts, avg/min/max cycle days for Drafting, Engineering, Plat, and Permitting</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">By Drafter</b> — breakdown per drafter</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">By Engineer</b> — breakdown per engineer</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">By Plat Engineer</b> — breakdown per plat engineer</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">By County</b> — breakdown per county</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-default-fg1 inline-block" />
                            <span><b className="text-default-fg1">All Projects</b> — full flat list of every project in the period</span>
                        </li>
                    </ul>
                </SectionCard>

                {/* Download button */}
                <div className="flex flex-col items-start gap-2">
                    <Button
                        onClick={handleDownload}
                        disabled={downloadState.status === "loading"}
                        className="flex items-center gap-2 px-6"
                    >
                        <MdDownload size="1.2rem" />
                        {downloadState.status === "loading" ? "Generating..." : "Download Excel Report"}
                    </Button>
                    <StatusBadge state={downloadState} />
                </div>

            </div>
        </MainLayout>
    );
}

export default ReportsPage;
