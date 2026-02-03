from typing import List, Dict, Any
from datetime import datetime
from io import BytesIO

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from openpyxl import Workbook
from openpyxl.styles import Font, Alignment, PatternFill, Border, Side
from openpyxl.utils import get_column_letter

from app.database.database import projects_coll
from app.database.schemas.project import Project
from app.database.schemas.department_data import EPCData

"""
Endpoint: /dev/analysis
Purpose:
  - Analysis and reporting endpoints for project data
"""

router = APIRouter(prefix="/dev/analysis")


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


def get_drafting_projects_by_year(year: int) -> Dict[str, Any]:
    """
    Helper function to get all projects with contract date in a given year.
    Returns projects sorted by contract date with drafting analysis.
    """
    all_docs = list(projects_coll.find())

    projects_for_year: List[Dict[str, Any]] = []

    for doc in all_docs:
        project_raw = {k: v for (k, v) in doc.items() if k != "_id"}

        try:
            project: Project = Project(**project_raw)
            epc_data: EPCData = EPCData(**project_raw["teclab_data"]["epc_data"])

            if not epc_data.contract_date:
                continue
            if epc_data.contract_date.year != year:
                continue

            drafting_days = None
            if epc_data.drafting_assigned_on and epc_data.drafting_finished:
                delta = epc_data.drafting_finished - epc_data.drafting_assigned_on
                drafting_days = max(0, round(delta.total_seconds() / 86400))

            project_info = {
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
            }

            projects_for_year.append(project_info)

        except Exception as e:
            print(f"ERROR parsing project: {e}")
            continue

    # Sort by contract date
    projects_for_year.sort(
        key=lambda x: x["contract_date"] if x["contract_date"] else datetime.min
    )

    # Calculate summary statistics
    total_projects = len(projects_for_year)
    projects_with_drafting = [p for p in projects_for_year if p["drafting_assigned_on"]]
    projects_drafting_complete = [p for p in projects_for_year if p["drafting_finished"]]
    drafting_days_list = [
        p["drafting_days"] for p in projects_for_year if p["drafting_days"] is not None
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
    }

    # Breakdown by product
    by_product: Dict[str, Dict[str, Any]] = {}
    for p in projects_for_year:
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
    for p in projects_for_year:
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

    return {
        "year": year,
        "summary": summary,
        "by_product": product_breakdown,
        "by_drafter": drafter_breakdown,
        "projects": projects_for_year,
    }


def generate_drafting_excel(data: Dict[str, Any]) -> BytesIO:
    """
    Helper function to generate Excel file from drafting data.
    """
    year = data["year"]
    wb = Workbook()

    # Styles
    header_font = Font(bold=True, color="FFFFFF")
    header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
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
    ws_summary["A1"] = f"{year} Drafting Analysis Summary"
    ws_summary["A1"].font = Font(bold=True, size=14)
    ws_summary.merge_cells("A1:B1")

    summary_rows = [
        ("Total Projects", summary["total_projects"]),
        ("Projects with Drafting Assigned", summary["projects_with_drafting_assigned"]),
        ("Projects Drafting Complete", summary["projects_drafting_complete"]),
        ("Average Drafting Days", summary["avg_drafting_days"]),
        ("Min Drafting Days", summary["min_drafting_days"]),
        ("Max Drafting Days", summary["max_drafting_days"]),
    ]
    for i, (label, value) in enumerate(summary_rows, start=3):
        ws_summary.cell(row=i, column=1, value=label).font = Font(bold=True)
        ws_summary.cell(row=i, column=2, value=value)

    auto_adjust_columns(ws_summary)

    # === Sheet 2: By Product ===
    ws_product = wb.create_sheet("By Product")

    product_headers = ["Product", "Total Projects", "Drafting Complete", "Avg Days", "Min Days", "Max Days"]
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

    drafter_headers = ["Drafter", "Total Projects", "Drafting Complete", "Avg Days", "Min Days", "Max Days"]
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

    # === Sheet 4: All Projects ===
    ws_projects = wb.create_sheet("All Projects")

    project_headers = [
        "Project ID", "Community", "Section", "Lot", "Contract Date", "Contract Type",
        "Product", "Elevation", "Drafter", "Assigned On", "Finished", "Days", "Notes"
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
        ws_projects.cell(row=row, column=5, value=p["contract_date"].strftime("%Y-%m-%d") if p["contract_date"] else None)
        ws_projects.cell(row=row, column=6, value=p["contract_type"])
        ws_projects.cell(row=row, column=7, value=p["product_name"])
        ws_projects.cell(row=row, column=8, value=p["elevation_name"])
        ws_projects.cell(row=row, column=9, value=p["drafting_drafter"])
        ws_projects.cell(row=row, column=10, value=p["drafting_assigned_on"].strftime("%Y-%m-%d") if p["drafting_assigned_on"] else None)
        ws_projects.cell(row=row, column=11, value=p["drafting_finished"].strftime("%Y-%m-%d") if p["drafting_finished"] else None)
        ws_projects.cell(row=row, column=12, value=p["drafting_days"])
        ws_projects.cell(row=row, column=13, value=p["drafting_notes"])
        row += 1

    auto_adjust_columns(ws_projects)

    # Save to BytesIO
    output = BytesIO()
    wb.save(output)
    output.seek(0)

    return output


# ============ 2025 Routes ============

@router.get("/2025/drafting", response_model=Dict[str, Any])
def get_2025_drafting_projects():
    """
    Get all projects with contract date in 2025, with drafting information.
    """
    return get_drafting_projects_by_year(2025)


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
        }
    )


# ============ 2026 Routes ============

@router.get("/2026/drafting", response_model=Dict[str, Any])
def get_2026_drafting_projects():
    """
    Get all projects with contract date in 2026, with drafting information.
    """
    return get_drafting_projects_by_year(2026)


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
        }
    )
