from typing import List
from pydantic import BaseModel


"""
Schema for a typical Eagle home
- Each project(home) will go through 
    - Cycles.
    - Cycle's have multiple stages.
    - Stage's have multiple tasks.
Each of the document is the giant data structure that will hold every data point related to a house(i.e., project)
- The Shape 
"""


class EagleHomeProjectTypical(BaseModel):
    pass


class PreReqTask(BaseModel):
    id: str # id of the task

class Task(BaseModel):
    id: str # unique for every task
    prerequisites: List[PreReqTask]


