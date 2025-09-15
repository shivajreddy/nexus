from typing import List, Optional
from datetime import datetime, timezone, timedelta
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.logger import logger
from app.router.utils import find_project
from app.settings.config import settings
from app.security.oauth2 import get_current_user_data


IHMS_BASE_URL = "https://api.ecimarksystems.com"
IHMS_API_URL = "https://api.ecimarksystems.com/rest/EVA"


class IHMS_Company_Info(BaseModel):
    COMPANYCODE: str
    COMPANY_NAME: str
    REGIONCODE: str
    DEVELOPMENTS: List["IHMS_Development_Info"]


class IHMS_Development_Info(BaseModel):
    # shape in ihms
    DEVELOPMENTCODE: str
    DESCRIPTION: str
    DIVISIONCODE: str
    SUPERINTENDENT: str
    PARENTCO: str
    PARENTDEV: str
    INACTIVE: str


class IHMS_Development_With_Comp_Info(IHMS_Development_Info):
    # extending with company info for convenience
    COMPANYCODE: str
    COMPANY_NAME: str
    REGIONCODE: str


async def get_all_companies() -> tuple[List[IHMS_Company_Info] | None, str | None]:
    """
    Get all the companies, and all their developments
    Returns: (data, error) tuple where one will be None
    """
    url = IHMS_API_URL + "/companies"
    # Get access token and return early if there's an error
    access_token, token_error = await get_access_token()
    if token_error:
        return None, f"Failed to get access token: {token_error}"

    headers = {"Content-Type": "application/json", "Authorization": access_token}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url=url, headers=headers, timeout=10.0)
            if response.status_code == 200:
                data = response.json()
                companies = [IHMS_Company_Info(**c) for c in data]
                return companies, None
            else:
                error_msg = f"API returned status code {response.status_code} \ndetails: {response.text}"
                logger.error(error_msg)
                return None, error_msg
        except httpx.RequestError as e:
            error_msg = f"Request failed: {str(e)}"
            logger.error(error_msg)
            return None, error_msg


async def get_all_developments(
    company_codes: List[str],
) -> tuple[List[IHMS_Development_With_Comp_Info] | None, str | None]:
    """
    - uses 'get_all_companies' and for each given company_code, takes out
    all the developments info
    """
    all_companies, err = await get_all_companies()
    if err or all_companies is None or len(all_companies) == 0:
        return None, err

    data = []

    for company in all_companies:
        if company.COMPANYCODE in company_codes:
            # add the company info for each development
            for development in company.DEVELOPMENTS:
                # skip/filter-out the inactive developments
                if development.INACTIVE == "Y":
                    continue
                development_with_company = IHMS_Development_With_Comp_Info(
                    DEVELOPMENTCODE=development.DEVELOPMENTCODE,
                    DESCRIPTION=development.DESCRIPTION,
                    DIVISIONCODE=development.DIVISIONCODE,
                    SUPERINTENDENT=development.SUPERINTENDENT,
                    PARENTCO=development.PARENTCO,
                    PARENTDEV=development.PARENTDEV,
                    INACTIVE=development.INACTIVE,
                    COMPANYCODE=company.COMPANYCODE,
                    COMPANY_NAME=company.COMPANY_NAME,
                    REGIONCODE=company.REGIONCODE,
                )
                data.append(development_with_company)

    return data, None


async def get_all_houses():
    """
    - GET all the house data, of the given columns
    Returns: (data, error) tuple where one will be None
    """
    # {{ihms_api_url}}/houses?fields=modelcode,elevationcode,casenumber,ratifiedDate
    url = IHMS_API_URL + "/houses"
    # Get access token and return early if there's an error
    access_token, token_error = await get_access_token()
    if token_error:
        return None, f"Failed to get access token: {token_error}"

    headers = {"Content-Type": "application/json", "Authorization": access_token}

    fields = [""]
    params = {"fields": "modelcode,elevationcode,casenumber,ratifiedDate"}

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                url=url, headers=headers, params=params, timeout=10.0
            )
            if response.status_code == 200:
                data = response.json()
                companies = [IHMS_Company_Info(**c) for c in data]
                return companies, None
            else:
                error_msg = f"API returned status code {response.status_code} \ndetails: {response.text}"
                logger.error(error_msg)
                return None, error_msg
        except httpx.RequestError as e:
            error_msg = f"Request failed: {str(e)}"
            logger.error(error_msg)
            return None, error_msg

    pass


async def get_houses_for_a_development():
    pass


async def get_closed_houses_for_a_development():
    pass


async def get_ratified_houses_for_a_development():
    pass


async def get_settled_houses_for_a_development():
    pass


async def get_house_statuses_for_a_development():
    pass


async def get_house_details():
    pass


async def get_house_columns():
    pass


class TokenManager:
    def __init__(self):  # Fixed the asterisks
        self._token: Optional[str] = None
        self._expires_at: Optional[datetime] = None

    async def get_access_token(self) -> tuple[str | None, str | None]:
        """Get cached token or fetch new one if expired"""
        if (
            self._token
            and self._expires_at
            and datetime.now(timezone.utc) < self._expires_at
        ):
            logger.info("Using cached access token")
            return self._token, None

        logger.info("Fetching new access token")
        return await self._fetch_new_token()

    async def _fetch_new_token(
        self,
    ) -> tuple[str | None, str | None]:  # Fixed the asterisks
        """Fetch new token from API and cache it"""
        url = IHMS_BASE_URL + "/accesstoken"
        data = {
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "grant_type": "client_credentials",
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}

        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    url=url, data=data, headers=headers, timeout=10.0
                )

                if response.status_code == 200:
                    response_data = response.json()

                    if (
                        "access_token" in response_data
                        and "expires_at" in response_data
                    ):
                        # Cache the token
                        self._token = response_data["access_token"]

                        # Parse the expiration time - make it timezone aware
                        expires_str = response_data["expires_at"].replace(" UTC", "")
                        self._expires_at = datetime.strptime(
                            expires_str, "%Y-%m-%d %H:%M:%S"
                        ).replace(
                            tzinfo=timezone.utc
                        )  # Make it timezone aware

                        # Add some buffer time (subtract 30 seconds to be safe)
                        self._expires_at -= timedelta(seconds=30)

                        logger.info(f"Token cached, expires at: {self._expires_at}")
                        return self._token, None
                    else:
                        error_msg = "Missing access_token or expires_at in response"
                        logger.error(error_msg)
                        return None, error_msg
                else:
                    error_msg = f"API returned status code {response.status_code}: {response.text}"
                    logger.error(error_msg)
                    return None, error_msg

            except httpx.RequestError as e:
                error_msg = f"Request failed: {str(e)}"
                logger.error(error_msg)
                return None, error_msg
            except ValueError as e:
                error_msg = f"Response parsing error: {str(e)}"
                logger.error(error_msg)
                return None, error_msg
            except Exception as e:
                error_msg = f"Unexpected error: {str(e)}"
                logger.error(error_msg)
                return None, error_msg


# Global instance
token_manager = TokenManager()


async def get_access_token() -> tuple[str | None, str | None]:
    """
    GET ACCESSTOKEN FROM IHMS with caching
    Returns: (access_token, error) tuple where one will be None
    """
    return await token_manager.get_access_token()
