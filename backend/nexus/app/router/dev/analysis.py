from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

from app.database.database import projects_coll
from app.database.schemas.project import Project
from app.database.schemas.department_data import EPCData
from app.database.schemas.security import AccessTokenData
from app.security.oauth2 import get_current_user_data

"""
Endpoint: /dev/analysis
Purpose:
  - Analysis and reporting endpoints for project data
"""

router = APIRouter(prefix="/dev/analysis")

# Allowed roles for analysis endpoints
ALLOWED_ROLES = [299, 999]


def require_analysis_roles(user_data: AccessTokenData = Depends(get_current_user_data)):
    """
    Dependency that checks if user has any of the allowed roles (299 or 999).
    """
    user_roles = user_data.roles
    if not any(role in user_roles for role in ALLOWED_ROLES):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You don't have access to this resource. Required roles: 299 or 999",
        )
    return user_data


class DraftingProjectResponse(BaseModel):
    """Response model for drafting project data"""

    project_id: str
    community: str
    section: str
    lot: str
    contract_date: datetime | None
    contract_type: str | None
    product_name: str | None
    elevation_name: str | None
    drafting_drafter: str | None
    drafting_assigned_on: datetime | None
    drafting_finished: datetime | None
    drafting_days: int | None
    drafting_notes: str | None


def _build_summary_and_breakdowns(
    projects: List[Dict[str, Any]],
    period_label: Dict[str, Any],
) -> Dict[str, Any]:
    """
    Given a filtered+sorted list of project dicts, compute summary stats
    and breakdowns by product, drafter, and county.
    """
    total_projects = len(projects)
    projects_with_drafting = [p for p in projects if p["drafting_assigned_on"]]
    projects_drafting_complete = [p for p in projects if p["drafting_finished"]]
    drafting_days_list = [
        p["drafting_days"] for p in projects if p["drafting_days"] is not None
    ]

    projects_with_permitting_submitted = [
        p for p in projects if p["permitting_submitted"]
    ]
    projects_permitting_received = [p for p in projects if p["permitting_received"]]
    permitting_days_list = [
        p["permitting_days"] for p in projects if p["permitting_days"] is not None
    ]

    summary = {
        "total_projects": total_projects,
        "projects_with_drafting_assigned": len(projects_with_drafting),
        "projects_drafting_complete": len(projects_drafting_complete),
        "avg_drafting_days": (
            round(sum(drafting_days_list) / len(drafting_days_list), 1)
            if drafting_days_list
            else None
        ),
        "min_drafting_days": min(drafting_days_list) if drafting_days_list else None,
        "max_drafting_days": max(drafting_days_list) if drafting_days_list else None,
        "projects_with_permitting_submitted": len(projects_with_permitting_submitted),
        "projects_permitting_received": len(projects_permitting_received),
        "avg_permitting_days": (
            round(sum(permitting_days_list) / len(permitting_days_list), 1)
            if permitting_days_list
            else None
        ),
        "min_permitting_days": (
            min(permitting_days_list) if permitting_days_list else None
        ),
        "max_permitting_days": (
            max(permitting_days_list) if permitting_days_list else None
        ),
    }

    # Breakdown by product
    by_product: Dict[str, Dict[str, Any]] = {}
    for p in projects:
        product = p["product_name"] or "Unknown"
        if product not in by_product:
            by_product[product] = {"count": 0, "drafting_days": []}
        by_product[product]["count"] += 1
        if p["drafting_days"] is not None:
            by_product[product]["drafting_days"].append(p["drafting_days"])

    product_breakdown = {}
    for product, data in by_product.items():
        days = data["drafting_days"]
        product_breakdown[product] = {
            "total_projects": data["count"],
            "drafting_complete": len(days),
            "avg_drafting_days": round(sum(days) / len(days), 1) if days else None,
            "min_drafting_days": min(days) if days else None,
            "max_drafting_days": max(days) if days else None,
        }

    # Breakdown by drafter
    by_drafter: Dict[str, Dict[str, Any]] = {}
    for p in projects:
        drafter = p["drafting_drafter"] or "Unassigned"
        if drafter not in by_drafter:
            by_drafter[drafter] = {"count": 0, "drafting_days": []}
        by_drafter[drafter]["count"] += 1
        if p["drafting_days"] is not None:
            by_drafter[drafter]["drafting_days"].append(p["drafting_days"])

    drafter_breakdown = {}
    for drafter, data in by_drafter.items():
        days = data["drafting_days"]
        drafter_breakdown[drafter] = {
            "total_projects": data["count"],
            "drafting_complete": len(days),
            "avg_drafting_days": round(sum(days) / len(days), 1) if days else None,
            "min_drafting_days": min(days) if days else None,
            "max_drafting_days": max(days) if days else None,
        }

    # Breakdown by county (for permitting cycle times)
    by_county: Dict[str, Dict[str, Any]] = {}
    for p in projects:
        county = p["permitting_county"] or "Unknown"
        if county not in by_county:
            by_county[county] = {"count": 0, "permitting_days": []}
        by_county[county]["count"] += 1
        if p["permitting_days"] is not None:
            by_county[county]["permitting_days"].append(p["permitting_days"])

    county_breakdown = {}
    for county, data in by_county.items():
        days = data["permitting_days"]
        county_breakdown[county] = {
            "total_projects": data["count"],
            "permitting_complete": len(days),
            "avg_permitting_days": round(sum(days) / len(days), 1) if days else None,
            "min_permitting_days": min(days) if days else None,
            "max_permitting_days": max(days) if days else None,
        }

    return {
        **period_label,
        "summary": summary,
        "by_product": product_breakdown,
        "by_drafter": drafter_breakdown,
        "by_county": county_breakdown,
        "projects": projects,
    }


def _fetch_all_project_infos() -> List[Dict[str, Any]]:
    """
    Fetch and parse all projects from the database into a flat info dict list.
    Only projects with a contract_date are included.
    """
    all_docs = list(projects_coll.find())
    result: List[Dict[str, Any]] = []

    for doc in all_docs:
        project_raw = {k: v for (k, v) in doc.items() if k != "_id"}
        try:
            project: Project = Project(**project_raw)
            epc_data: EPCData = EPCData(**project_raw["teclab_data"]["epc_data"])

            if not epc_data.contract_date:
                continue

            drafting_days = None
            if epc_data.drafting_assigned_on and epc_data.drafting_finished:
                delta = epc_data.drafting_finished - epc_data.drafting_assigned_on
                drafting_days = max(0, round(delta.total_seconds() / 86400))

            permitting_days = None
            if epc_data.permitting_submitted and epc_data.permitting_received:
                delta = epc_data.permitting_received - epc_data.permitting_submitted
                permitting_days = max(0, round(delta.total_seconds() / 86400))

            result.append(
                {
                    "project_id": project.project_info.project_id,
                    "community": project.project_info.community,
                    "section": project.project_info.section,
                    "lot": project.project_info.lot_number,
                    "contract_date": epc_data.contract_date,
                    "contract_type": epc_data.contract_type,
                    "product_name": epc_data.product_name,
                    "elevation_name": epc_data.elevation_name,
                    "drafting_drafter": epc_data.drafting_drafter,
                    "drafting_assigned_on": epc_data.drafting_assigned_on,
                    "drafting_finished": epc_data.drafting_finished,
                    "drafting_days": drafting_days,
                    "drafting_notes": epc_data.drafting_notes,
                    "permitting_county": epc_data.permitting_county_name,
                    "permitting_submitted": epc_data.permitting_submitted,
                    "permitting_received": epc_data.permitting_received,
                    "permitting_days": permitting_days,
                }
            )
        except Exception as e:
            print(f"ERROR parsing project: {e}")
            continue

    return result


def get_drafting_projects_by_year(year: int) -> Dict[str, Any]:
    """
    Returns projects with contract date in the given year, with drafting analysis.
    """
    all_projects = _fetch_all_project_infos()
    filtered = [p for p in all_projects if p["contract_date"].year == year]
    filtered.sort(key=lambda x: x["contract_date"])
    return _build_summary_and_breakdowns(filtered, {"year": year})


def get_drafting_projects_by_month(year: int, month: int) -> Dict[str, Any]:
    """
    Returns projects with contract date in the given year+month, with drafting analysis.
    """
    all_projects = _fetch_all_project_infos()
    filtered = [
        p
        for p in all_projects
        if p["contract_date"].year == year and p["contract_date"].month == month
    ]
    filtered.sort(key=lambda x: x["contract_date"])
    return _build_summary_and_breakdowns(filtered, {"year": year, "month": month})


def get_drafting_projects_current_week() -> Dict[str, Any]:
    """
    Returns projects with contract date in the current calendar week (Mon–Sun),
    with drafting analysis.
    """
    today = datetime.utcnow().date()
    week_start = datetime.combine(today - timedelta(days=today.weekday()), datetime.min.time())
    week_end = week_start + timedelta(days=7)

    all_projects = _fetch_all_project_infos()
    filtered = [
        p
        for p in all_projects
        if week_start <= p["contract_date"].replace(tzinfo=None) < week_end
    ]
    filtered.sort(key=lambda x: x["contract_date"])
    return _build_summary_and_breakdowns(
        filtered,
        {
            "week_start": week_start.strftime("%Y-%m-%d"),
            "week_end": (week_end - timedelta(days=1)).strftime("%Y-%m-%d"),
        },
    )


def generate_drafting_excel(data: Dict[str, Any]) -> BytesIO:
    """
    Helper function to generate Excel file from drafting data.
    """
    if "week_start" in data:
        period_title = f"Week of {data['week_start']} – {data['week_end']}"
    elif "month" in data:
        period_title = f"{data['year']} {MONTH_NAMES.get(data['month'], data['month'])}"
    else:
        period_title = str(data["year"])

    wb = Workbook()

    # Styles
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(
        start_color="4472C4", end_color="4472C4", fill_type="solid"
    )
    header_alignment = Alignment(horizontal="center", vertical="center")
    thin_border = Border(
        left=Side(style="thin"),
        right=Side(style="thin"),
        top=Side(style="thin"),
        bottom=Side(style="thin"),
    )

    def style_header_row(ws, row_num, num_cols):
        for col in range(1, num_cols + 1):
            cell = ws.cell(row=row_num, column=col)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment
            cell.border = thin_border

    def auto_adjust_columns(ws):
        for col_idx, column_cells in enumerate(ws.columns, 1):
            max_length = 0
            column = get_column_letter(col_idx)
            for cell in column_cells:
                try:
                    if cell.value:
                        max_length = max(max_length, len(str(cell.value)))
                except:
                    pass
            ws.column_dimensions[column].width = min(max_length + 2, 50)

    # === Sheet 1: Summary ===
    ws_summary = wb.active
    ws_summary.title = "Summary"

    summary = data["summary"]
    ws_summary["A1"] = f"{period_title} Analysis Summary"
    ws_summary["A1"].font = Font(bold=True, size=14)
    ws_summary.merge_cells("A1:B1")

    # Drafting summary
    ws_summary.cell(row=3, column=1, value="DRAFTING").font = Font(bold=True, size=12)
    drafting_rows = [
        ("Projects with Drafting Assigned", summary["projects_with_drafting_assigned"]),
        ("Projects Drafting Complete", summary["projects_drafting_complete"]),
        ("Average Drafting Days", summary["avg_drafting_days"]),
        ("Min Drafting Days", summary["min_drafting_days"]),
        ("Max Drafting Days", summary["max_drafting_days"]),
    ]
    for i, (label, value) in enumerate(drafting_rows, start=4):
        ws_summary.cell(row=i, column=1, value=label).font = Font(bold=True)
        ws_summary.cell(row=i, column=2, value=value)

    # Permitting summary
    ws_summary.cell(row=10, column=1, value="PERMITTING").font = Font(
        bold=True, size=12
    )
    permitting_rows = [
        (
            "Projects with Permitting Submitted",
            summary["projects_with_permitting_submitted"],
        ),
        ("Projects Permitting Received", summary["projects_permitting_received"]),
        ("Average Permitting Days", summary["avg_permitting_days"]),
        ("Min Permitting Days", summary["min_permitting_days"]),
        ("Max Permitting Days", summary["max_permitting_days"]),
    ]
    for i, (label, value) in enumerate(permitting_rows, start=11):
        ws_summary.cell(row=i, column=1, value=label).font = Font(bold=True)
        ws_summary.cell(row=i, column=2, value=value)

    # Total projects at the end
    ws_summary.cell(row=17, column=1, value="Total Projects").font = Font(bold=True)
    ws_summary.cell(row=17, column=2, value=summary["total_projects"])

    auto_adjust_columns(ws_summary)

    # === Sheet 2: By Product ===
    ws_product = wb.create_sheet("By Product")

    product_headers = [
        "Product",
        "Total Projects",
        "Drafting Complete",
        "Avg Days",
        "Min Days",
        "Max Days",
    ]
    for col, header in enumerate(product_headers, start=1):
        ws_product.cell(row=1, column=col, value=header)
    style_header_row(ws_product, 1, len(product_headers))

    row = 2
    for product, stats in data["by_product"].items():
        ws_product.cell(row=row, column=1, value=product)
        ws_product.cell(row=row, column=2, value=stats["total_projects"])
        ws_product.cell(row=row, column=3, value=stats["drafting_complete"])
        ws_product.cell(row=row, column=4, value=stats["avg_drafting_days"])
        ws_product.cell(row=row, column=5, value=stats["min_drafting_days"])
        ws_product.cell(row=row, column=6, value=stats["max_drafting_days"])
        row += 1

    auto_adjust_columns(ws_product)

    # === Sheet 3: By Drafter ===
    ws_drafter = wb.create_sheet("By Drafter")

    drafter_headers = [
        "Drafter",
        "Total Projects",
        "Drafting Complete",
        "Avg Days",
        "Min Days",
        "Max Days",
    ]
    for col, header in enumerate(drafter_headers, start=1):
        ws_drafter.cell(row=1, column=col, value=header)
    style_header_row(ws_drafter, 1, len(drafter_headers))

    row = 2
    for drafter, stats in data["by_drafter"].items():
        ws_drafter.cell(row=row, column=1, value=drafter)
        ws_drafter.cell(row=row, column=2, value=stats["total_projects"])
        ws_drafter.cell(row=row, column=3, value=stats["drafting_complete"])
        ws_drafter.cell(row=row, column=4, value=stats["avg_drafting_days"])
        ws_drafter.cell(row=row, column=5, value=stats["min_drafting_days"])
        ws_drafter.cell(row=row, column=6, value=stats["max_drafting_days"])
        row += 1

    auto_adjust_columns(ws_drafter)

    # === Sheet 4: By County (Permitting) ===
    ws_county = wb.create_sheet("By County")

    county_headers = [
        "County",
        "Total Projects",
        "Permitting Complete",
        "Avg Permitting Days",
        "Min Permitting Days",
        "Max Permitting Days",
    ]
    for col, header in enumerate(county_headers, start=1):
        ws_county.cell(row=1, column=col, value=header)
    style_header_row(ws_county, 1, len(county_headers))

    row = 2
    for county, stats in data["by_county"].items():
        ws_county.cell(row=row, column=1, value=county)
        ws_county.cell(row=row, column=2, value=stats["total_projects"])
        ws_county.cell(row=row, column=3, value=stats["permitting_complete"])
        ws_county.cell(row=row, column=4, value=stats["avg_permitting_days"])
        ws_county.cell(row=row, column=5, value=stats["min_permitting_days"])
        ws_county.cell(row=row, column=6, value=stats["max_permitting_days"])
        row += 1

    auto_adjust_columns(ws_county)

    # === Sheet 5: All Projects ===
    ws_projects = wb.create_sheet("All Projects")

    project_headers = [
        "Project ID",
        "Community",
        "Section",
        "Lot",
        "Contract Date",
        "Contract Type",
        "Product",
        "Elevation",
        "Drafter",
        "Drafting Assigned",
        "Drafting Finished",
        "Drafting Days",
        "Drafting Notes",
        "County",
        "Permitting Submitted",
        "Permitting Received",
        "Permitting Days",
    ]
    for col, header in enumerate(project_headers, start=1):
        ws_projects.cell(row=1, column=col, value=header)
    style_header_row(ws_projects, 1, len(project_headers))

    row = 2
    for p in data["projects"]:
        ws_projects.cell(row=row, column=1, value=p["project_id"])
        ws_projects.cell(row=row, column=2, value=p["community"])
        ws_projects.cell(row=row, column=3, value=p["section"])
        ws_projects.cell(row=row, column=4, value=p["lot"])
        ws_projects.cell(
            row=row,
            column=5,
            value=(
                p["contract_date"].strftime("%Y-%m-%d") if p["contract_date"] else None
            ),
        )
        ws_projects.cell(row=row, column=6, value=p["contract_type"])
        ws_projects.cell(row=row, column=7, value=p["product_name"])
        ws_projects.cell(row=row, column=8, value=p["elevation_name"])
        ws_projects.cell(row=row, column=9, value=p["drafting_drafter"])
        ws_projects.cell(
            row=row,
            column=10,
            value=(
                p["drafting_assigned_on"].strftime("%Y-%m-%d")
                if p["drafting_assigned_on"]
                else None
            ),
        )
        ws_projects.cell(
            row=row,
            column=11,
            value=(
                p["drafting_finished"].strftime("%Y-%m-%d")
                if p["drafting_finished"]
                else None
            ),
        )
        ws_projects.cell(row=row, column=12, value=p["drafting_days"])
        ws_projects.cell(row=row, column=13, value=p["drafting_notes"])
        ws_projects.cell(row=row, column=14, value=p["permitting_county"])
        ws_projects.cell(
            row=row,
            column=15,
            value=(
                p["permitting_submitted"].strftime("%Y-%m-%d")
                if p["permitting_submitted"]
                else None
            ),
        )
        ws_projects.cell(
            row=row,
            column=16,
            value=(
                p["permitting_received"].strftime("%Y-%m-%d")
                if p["permitting_received"]
                else None
            ),
        )
        ws_projects.cell(row=row, column=17, value=p["permitting_days"])
        row += 1

    auto_adjust_columns(ws_projects)

    # Save to BytesIO
    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return output


# ============ Current Week Routes ============


@router.get(
    "/current-week/drafting",
    response_model=Dict[str, Any],
    dependencies=[Depends(require_analysis_roles)],
)
def get_current_week_drafting_projects():
    """
    Get all projects with contract date in the current calendar week (Mon–Sun).
    """
    return get_drafting_projects_current_week()


@router.get(
    "/current-week/drafting/excel",
    dependencies=[Depends(require_analysis_roles)],
)
def get_current_week_drafting_excel():
    """
    Export current-week drafting analysis to Excel file.
    """
    data = get_drafting_projects_current_week()
    output = generate_drafting_excel(data)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"current_week_drafting_analysis_{timestamp}.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Cache-Control": "no-cache",
        },
    )


# ============ 2025 Routes ============


@router.get(
    "/2025/drafting",
    response_model=Dict[str, Any],
    dependencies=[Depends(require_analysis_roles)],
)
def get_2025_drafting_projects():
    """
    Get all projects with contract date in 2025, with drafting information.
    """
    return get_drafting_projects_by_year(2025)


# @router.get("/2025/drafting/excel", dependencies=[Depends(require_analysis_roles)])
@router.get("/2025/drafting/excel")
def get_2025_drafting_excel():
    """
    Export 2025 drafting analysis to Excel file.
    """
    data = get_drafting_projects_by_year(2025)
    output = generate_drafting_excel(data)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"2025_drafting_analysis_{timestamp}.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Cache-Control": "no-cache",
        },
    )


# ============ 2026 Routes ============


@router.get(
    "/2026/drafting",
    response_model=Dict[str, Any],
    dependencies=[Depends(require_analysis_roles)],
)
def get_2026_drafting_projects():
    """
    Get all projects with contract date in 2026, with drafting information.
    """
    return get_drafting_projects_by_year(2026)


# @router.get("/2026/drafting/excel", dependencies=[Depends(require_analysis_roles)])
@router.get("/2026/drafting/excel")
def get_2026_drafting_excel():
    """
    Export 2026 drafting analysis to Excel file.
    """
    data = get_drafting_projects_by_year(2026)
    output = generate_drafting_excel(data)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"2026_drafting_analysis_{timestamp}.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Cache-Control": "no-cache",
        },
    )


# ============ 2026 Monthly Routes ============

MONTH_NAMES = {
    1: "January", 2: "February", 3: "March", 4: "April",
    5: "May", 6: "June", 7: "July", 8: "August",
    9: "September", 10: "October", 11: "November", 12: "December",
}


@router.get(
    "/2026/{month}/drafting",
    response_model=Dict[str, Any],
    dependencies=[Depends(require_analysis_roles)],
)
def get_2026_monthly_drafting_projects(month: int):
    """
    Get all projects with contract date in a given month of 2026 (month = 1–12).
    """
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Month must be between 1 and 12",
        )
    return get_drafting_projects_by_month(2026, month)


@router.get(
    "/2026/{month}/drafting/excel",
    dependencies=[Depends(require_analysis_roles)],
)
def get_2026_monthly_drafting_excel(month: int):
    """
    Export a given month of 2026 drafting analysis to Excel file.
    """
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Month must be between 1 and 12",
        )
    data = get_drafting_projects_by_month(2026, month)
    output = generate_drafting_excel(data)

    month_name = MONTH_NAMES.get(month, str(month))
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"2026_{month_name}_drafting_analysis_{timestamp}.xlsx"

    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Cache-Control": "no-cache",
        },
    )
