from datetime import datetime
from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel

"""
Schema for `department-data`
Each collection holds all the data that relates only to that department
Key -> 'department_name'
"""


