from datetime import datetime
from typing import List

from db import Base
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()

    projects: Mapped[List["Project"]] = relationship(back_populates="user")


class Project(Base):
    __tablename__ = "projects"
    project_id: Mapped[int] = mapped_column(primary_key=True)
    projectName: Mapped[str] = mapped_column()
    businessLogic: Mapped[str] = mapped_column()
    projectUrl: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    user: Mapped["User"] = relationship(back_populates="projects")
    tests: Mapped[List["Test"]] = relationship(back_populates="project")
    routes: Mapped[List["Route"]] = relationship(back_populates="project")


from typing import List

from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship


class Route(Base):
    __tablename__ = "routes"

    route_id: Mapped[int] = mapped_column(primary_key=True)
    routename: Mapped[str] = mapped_column()

    # NEW — HTTP Method of the route
    method: Mapped[str] = mapped_column(default="GET")

    # Link route → project
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.project_id"))
    project: Mapped["Project"] = relationship(back_populates="routes")

    # Reverse relation for tests
    tests: Mapped[List["Test"]] = relationship(back_populates="route")


class Test(Base):
    __tablename__ = "tests"
    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column()

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.project_id"))
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.route_id"))

    project: Mapped["Project"] = relationship(back_populates="tests")

    # NEW
    route: Mapped["Route"] = relationship(back_populates="tests")

    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        default=func.now(), onupdate=func.now()
    )


# Legacy table (optional)
class Url(Base):
    __tablename__ = "url"
    url_id: Mapped[int] = mapped_column(primary_key=True)
    urlname: Mapped[str] = mapped_column()


class TestResult(Base):
    __tablename__ = "test_results"

    id: Mapped[int] = mapped_column(primary_key=True)
    test_id: Mapped[int] = mapped_column(ForeignKey("tests.id"))
    passed: Mapped[bool] = mapped_column()
    actual_status: Mapped[int] = mapped_column(nullable=True)
    actual_body: Mapped[str] = mapped_column(nullable=True)
    created_at: Mapped[datetime] = mapped_column(default=func.now())
