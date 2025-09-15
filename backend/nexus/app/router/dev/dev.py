from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from app.database.database import get_ihms_session
from app.database.schemas.ihms_schema import IHMSTableUDHouseMaster
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

    return res


@router.get("/pipeline/v2")
async def pipeline_v2(session: AsyncSession = Depends((get_ihms_session))):
    """
    Variant-2 of main pipeline report
    """
    pass


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
