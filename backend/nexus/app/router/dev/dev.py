from datetime import datetime
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import session
from app.database.database import get_ihms_session
from app.database.schemas.ihms_schema import (
    IHMSTableHouseMaster,
    IHMSTableSchedHouseDetail,
    IHMSTableUDHouseMaster,
    IHMSTableUDProspectMst,
)
from app.router.department.common.eci_marksystems import get_all_houses

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text


"""
Endpoint: /dev
Purpose:
  - routes under development
"""

router = APIRouter(prefix="/dev")


def clean_row(row: dict) -> dict:
    """Remove null bytes and trim spaces from all string fields in a row dict."""
    cleaned = {}
    for k, v in row.items():
        if isinstance(v, str):
            cleaned[k] = v.replace("\x00", "").strip()
        else:
            cleaned[k] = v
    return cleaned


@router.get("/pipeline/all")
async def pipeline_all(session: AsyncSession = Depends((get_ihms_session))):
    """
    Fetch every single column from IHMS
    """
    start_time = datetime.now()
    query = text(
        """
        SELECT *
        FROM eva_ihms.udhousemaster
        WHERE housenumber = '00000000'
          AND companycode = '001'
          AND developmentcode = '00'
        """
    )
    result = await session.execute(query)
    rows = result.fetchall()

    # Convert each SQLAlchemy Row to dict
    data_list = [dict(row._mapping) for row in rows]

    # Clean null bytes and spaces
    cleaned_data = [clean_row(row) for row in data_list]

    # Convert to Pydantic models
    res = [IHMSTableUDHouseMaster(**row_data) for row_data in cleaned_data]

    end_time = datetime.now()
    time_taken = (end_time - start_time).seconds
    return {"time_taken": time_taken, "data": res}


@router.get("/pipeline/work2")
# combined sql query
async def ddd(session: AsyncSession = Depends((get_ihms_session))):
    start_time = datetime.now()

    # Pipeline Master11
    query_pipeline_master_11 = text(
        """
        SELECT
            hm.developmentcode AS dev,
            hm.unpackedhousenum,
            hm.modelcode AS model,
            hm.elevationcode AS elev
        FROM housemaster hm
        WHERE hm.companycode = '001'
        AND hm.costflag <> 'X'
        AND hm.unpackedhousenum <> '00000000'
        AND hm.unpackedhousenum <> '99999990'
        AND hm.modelcode <> 'UNK'
        AND hm.buyername IS NOT NULL
        AND hm.developmentcode NOT IN ('00', '99', 'RN')
        AND hm.developmentcode NOT LIKE 'X%'
        AND (
                hm.conststart_date > DATE_SUB(CURRENT_DATE, INTERVAL 14 DAY)
                OR hm.conststart_date IS NULL
            );
        """
    )

    # IHMS update times
    query_ihms_update_times = text(
        """
        SELECT 
            DATE_FORMAT(completed_stamp, '%b %d, %Y') AS Date,
            DATE_FORMAT(completed_stamp, '%l:%i %p') AS Time
        FROM 
            replverify
        WHERE 
            completed_stamp >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
        ORDER BY verify_id DESC
        LIMIT 10;
        """
    )
    ihms_update_time_res = await session.execute(query_ihms_update_times)
    ihms_update_time = [dict(row._mapping) for row in ihms_update_time_res.fetchall()]

    # combined statments of 'House Master', 'Footing Date'
    query = text(
        """
        SELECT 
            hm.unpackedhousenum,
            hm.housenumber,
            hm.developmentcode,
            hm.modelcode AS 'model',
            hm.elevationcode AS 'elev',
            hm.conststart_date,
            hm.blocknumber,
            hm.lotnumber,
            hm.misc4_date AS 'arb_submit',
            hm.misc1_date AS 'arb_approved',
            hm.misc8_date AS 'permit_applied',
            hm.permit_date,
            hm.ins1_date AS 'bbp_posted',
            hm.misc9_date AS 'po_released',
            hm.buyername,
            hm.ratified_date,
            hm.misc2_date,
            udhm.lslatechangedate,

            udhm.companycode, 
            NULLIF(TRIM(REPLACE(udhm.draftedby, CHAR(0), '')), '') AS draftedby,
            udhm.platordereddate, 
            udhm.platrecdate, 
            NULLIF(TRIM(REPLACE(udhm.structuralco, CHAR(0), '')), '') AS structuralco, 
            udhm.engordereddate, 
            udhm.engrecvddate, 
            udhm.pmrevjobdate, 
            udhm.homesiterprtdate, 
            NULLIF(TRIM(REPLACE(udhm.notes, CHAR(0), '')), '') AS notes, 

            shd.developmentcode,
            shd.housenumber,
            shd.activitycode,
            shd.actualstartdate AS 'foundation_start',
            shd.actualfinishdate AS 'foundation_finish',

            hm.estsettl_date,

            shd.stepnumber, 
            shd.activitycode, 
            shd.earlystartdate, 
            shd.earlyfinishdate, 
            shd.latestartdate, 
            shd.latefinishdate,

            NULLIF(TRIM(REPLACE(udpm.loanstatuscom, CHAR(0), '')), '') AS loanstatuscom, 
            udpm.selectionduedate, 
            udpm.lifstloptduedate, 
            udpm.lscompletedate
        FROM 
            housemaster hm,
            udhousemaster udhm,
            schedhousedetail shd,
            udprospectmst udpm
        WHERE 
            udhm.companycode = hm.companycode 
            AND udhm.developmentcode = hm.developmentcode 
            AND udhm.housenumber = hm.housenumber

            AND hm.companycode = shd.companycode 
            AND hm.developmentcode = shd.developmentcode 
            AND hm.housenumber = shd.housenumber 
            AND shd.activitycode = '010' 
            AND hm.costflag <> 'X'

            AND hm.estsettl_date > '2023-06-15'

            AND udpm.casenumber = hm.casenumber;
        """
    )

    # Convert SQLAlchemy rows to dicts and then to Pydantic models
    # report_data = [IHMSReportRow(**dict(row)) for row in rows]
    result = await session.execute(query)
    rows = result.fetchall()
    data = [dict(row._mapping) for row in rows]

    end_time = datetime.now()
    time_taken = end_time - start_time

    return {
        "time_taken": time_taken,
        "count": len(data),
        "data": data,
        "IHMS Latest Updated time": ihms_update_time,
    }


# get_all_tables_for_ihms_report
@router.get("/pipeline/work")
async def gggg(
    session: AsyncSession = Depends((get_ihms_session)),
):
    start_time = datetime.now()
    # 'housemaster'
    housemaster_query = text(
        """
            SELECT * 
            FROM housemaster
        """
    )
    housemaster_res = await session.execute(housemaster_query)
    housemaster_rows = housemaster_res.mappings().all()
    housemaster_data = [
        IHMSTableHouseMaster.model_validate(row, from_attributes=True)
        for row in housemaster_rows
    ]
    print(len(housemaster_data))

    # 'udhousemaster'
    udhousemaster_query = text(
        """
            SELECT * 
            FROM udhousemaster
        """
    )
    udhousemaster_res = await session.execute(udhousemaster_query)
    udhousemaster_rows = udhousemaster_res.mappings().all()
    udhousemaster_data = [
        IHMSTableUDHouseMaster.model_validate(row, from_attributes=True)
        for row in udhousemaster_rows
    ]
    print(len(udhousemaster_data))

    # 'udprospectmst'
    udprospectmst_query = text(
        """
            SELECT *
            FROM udprospectmst
        """
    )
    udprospectmst_res = await session.execute(udprospectmst_query)
    udprospectmst_rows = udprospectmst_res.mappings().all()
    udprospectmst_data = [
        IHMSTableUDProspectMst.model_validate(row, from_attributes=True)
        for row in udprospectmst_rows
    ]
    print(len(udprospectmst_data))

    # 'schedhousedetail'
    schedhousedetail_query = text(
        """
            SELECT *
            FROM schedhousedetail
        """
    )
    schedhousedetail_res = await session.execute(schedhousedetail_query)
    schedhousedetail_rows = schedhousedetail_res.mappings().all()
    schedhousedetail_data = [
        IHMSTableSchedHouseDetail.model_validate(row, from_attributes=True)
        for row in schedhousedetail_rows
    ]
    print(len(schedhousedetail_data))

    end_time = datetime.now()
    return [
        len(housemaster_data),
        len(udhousemaster_data),
        len(udprospectmst_data),
        len(schedhousedetail_data),
        (end_time - start_time).seconds,
    ]


@router.get("/pipeline/main")
async def pipeline_main(
    session: AsyncSession = Depends(get_ihms_session),
) -> List[Dict[str, Any]]:
    """
    Main Pipeline report that Eagle uses weekly
    """
    query_original = text(
        """
        SELECT 
            udhousemaster_0.companycode, 
            housemaster_0.developmentcode, 
            housemaster_0.unpackedhousenum, 
            udhousemaster_0.draftedby, 
            udhousemaster_0.platordereddate, 
            udhousemaster_0.platrecdate, 
            udhousemaster_0.structuralco, 
            udhousemaster_0.engordereddate, 
            udhousemaster_0.engrecvddate, 
            udhousemaster_0.pmrevjobdate, 
            housemaster_0.conststart_date, 
            housemaster_0.blocknumber, 
            housemaster_0.lotnumber, 
            housemaster_0.misc4_date AS 'ARB Submit', 
            housemaster_0.misc1_date AS 'ARB Approve', 
            housemaster_0.misc8_date AS 'Permit Applied', 
            housemaster_0.permit_date, 
            housemaster_0.ins1_date AS 'BBP Posted', 
            housemaster_0.misc9_date AS 'PO Released', 
            housemaster_0.buyername, 
            udhousemaster_0.homesiterprtdate, 
            udhousemaster_0.notes, 
            housemaster_0.misc2_date
        FROM eva_ihms.housemaster housemaster_0, eva_ihms.udhousemaster udhousemaster_0
        WHERE udhousemaster_0.companycode = housemaster_0.companycode 
            AND udhousemaster_0.developmentcode = housemaster_0.developmentcode 
            AND udhousemaster_0.housenumber = housemaster_0.housenumber 
            AND udhousemaster_0.companycode = '001' 
            AND housemaster_0.costflag <> 'X'"
        """
    )

    # Option 1: Clean data in SQL using TRIM and REPLACE
    query_clean = text(
        """
        SELECT 
            TRIM(REPLACE(udhousemaster_0.companycode, CHAR(0), '')) as companycode,
            TRIM(REPLACE(housemaster_0.developmentcode, CHAR(0), '')) as developmentcode,
            TRIM(REPLACE(housemaster_0.unpackedhousenum, CHAR(0), '')) as unpackedhousenum,
            TRIM(REPLACE(udhousemaster_0.draftedby, CHAR(0), '')) as draftedby,
            udhousemaster_0.platordereddate, 
            udhousemaster_0.platrecdate, 
            TRIM(REPLACE(udhousemaster_0.structuralco, CHAR(0), '')) as structuralco,
            udhousemaster_0.engordereddate, 
            udhousemaster_0.engrecvddate, 
            udhousemaster_0.pmrevjobdate, 
            housemaster_0.conststart_date, 
            TRIM(REPLACE(housemaster_0.blocknumber, CHAR(0), '')) as blocknumber,
            TRIM(REPLACE(housemaster_0.lotnumber, CHAR(0), '')) as lotnumber,
            housemaster_0.misc4_date AS 'ARB Submit', 
            housemaster_0.misc1_date AS 'ARB Approve', 
            housemaster_0.misc8_date AS 'Permit Applied', 
            housemaster_0.permit_date, 
            housemaster_0.ins1_date AS 'BBP Posted', 
            housemaster_0.misc9_date AS 'PO Released', 
            TRIM(REPLACE(housemaster_0.buyername, CHAR(0), '')) as buyername,
            udhousemaster_0.homesiterprtdate, 
            TRIM(REPLACE(udhousemaster_0.notes, CHAR(0), '')) as notes,
            housemaster_0.misc2_date
        FROM eva_ihms.housemaster housemaster_0, eva_ihms.udhousemaster udhousemaster_0
        WHERE udhousemaster_0.companycode = housemaster_0.companycode 
            AND udhousemaster_0.developmentcode = housemaster_0.developmentcode 
            AND udhousemaster_0.housenumber = housemaster_0.housenumber 
            AND udhousemaster_0.companycode = '001' 
            AND housemaster_0.costflag <> 'X'
    """
    )

    query_clean_with_or = text(
        """
        SELECT 

            housemaster_0.address1 as address1,
            housemaster_0.address2 as address2,
            housemaster_0.address3 as address3,

            TRIM(REPLACE(udhousemaster_0.companycode, CHAR(0), '')) as companycode,
            TRIM(REPLACE(housemaster_0.developmentcode, CHAR(0), '')) as developmentcode,
            TRIM(REPLACE(housemaster_0.unpackedhousenum, CHAR(0), '')) as unpackedhousenum,
            TRIM(REPLACE(udhousemaster_0.draftedby, CHAR(0), '')) as draftedby,
            udhousemaster_0.platordereddate, 
            udhousemaster_0.platrecdate, 
            TRIM(REPLACE(udhousemaster_0.structuralco, CHAR(0), '')) as structuralco,
            udhousemaster_0.engordereddate, 
            udhousemaster_0.engrecvddate, 
            udhousemaster_0.pmrevjobdate, 
            housemaster_0.conststart_date, 
            TRIM(REPLACE(housemaster_0.blocknumber, CHAR(0), '')) as blocknumber,
            TRIM(REPLACE(housemaster_0.lotnumber, CHAR(0), '')) as lotnumber,
            housemaster_0.misc4_date AS 'ARB Submit', 

            housemaster_0.misc1_date AS 'ARB Approve', 
            housemaster_0.misc8_date AS 'Permit Applied', 
            housemaster_0.permit_date, 
            housemaster_0.ins1_date AS 'BBP Posted', 
            housemaster_0.misc9_date AS 'PO Released', 
            TRIM(REPLACE(housemaster_0.buyername, CHAR(0), '')) as buyername,

            udhousemaster_0.homesiterprtdate, 
            TRIM(REPLACE(udhousemaster_0.notes, CHAR(0), '')) as notes,
            housemaster_0.misc2_date
        FROM eva_ihms.housemaster housemaster_0, eva_ihms.udhousemaster udhousemaster_0
        WHERE udhousemaster_0.companycode = housemaster_0.companycode 
            AND udhousemaster_0.developmentcode = housemaster_0.developmentcode 
            AND udhousemaster_0.housenumber = housemaster_0.housenumber 
            AND (udhousemaster_0.companycode = '001' OR udhousemaster_0.companycode = '116')
            AND housemaster_0.costflag <> 'X'
        """
    )

    result = await session.execute(query_clean_with_or)
    rows = result.fetchall()
    return [dict(row._mapping) for row in rows]


@router.get("/test2", response_model=dict)
async def test2():
    # data, error = await get_all_companies()
    # data, error = await get_all_developments(["001", "116"])
    data, error = await get_all_houses()
    return {"data": data, "error": error}
    # return {"TEST": "OK", "DATA": data}
