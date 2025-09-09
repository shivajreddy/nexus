from typing import List
from pydantic import BaseModel
import uuid
from sqlalchemy import Column, String, ForeignKey, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship, declarative_base

"""
Schema for a typical Eagle home
- Each project(home) will go through 
    - Cycles.
    - Cycle's have multiple stages.
    - Stage's have multiple tasks.
Each of the document is the giant data structure that will hold every data point related to a house(i.e., project)
- The Shape 
"""

Base = declarative_base()


class EagleHomeProjectDB(Base):
    """This is a typical home project for Eagle."""

    __tablename__ = "projects"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


class ProjectCycleDB(Base):
    """A cycle can have multiple stages"""

    __tablename__ = "project_cycles"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String)
    # stages = list of all the stages here


class ProjectStageDB(Base):
    """A"""

    __tablename__ = "project_stages"
    project_cycle_id = Column(UUID(as_uuid=True), ForeignKey("project_cycles.id"))
    # tasks = list of tasks here


class PreReqTaskDB(Base):
    """
    Pointer to a Task, from another task, describing the prerequisite conditions
    """

    __tablename__ = "pre_req_tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)


# Many-to-many relationship for prerequisites
task_prereq_association = Table(
    "task_prerequisites",
    Base.metadata,
    Column(
        "task_id", UUID(as_uuid=True), ForeignKey("project_tasks.id"), primary_key=True
    ),
    Column(
        "prereq_id",
        UUID(as_uuid=True),
        ForeignKey("pre_req_tasks.id"),
        primary_key=True,
    ),
)


class ProjectTaskDB(Base):
    __tablename__ = "project_tasks"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    prerequisites = relationship("PreReqTaskDB", secondary=task_prereq_association)
