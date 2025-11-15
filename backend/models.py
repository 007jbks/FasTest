from datetime import datetime
from typing import List

from db import Base
from sqlalchemy import ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class User(Base):
    __tablename__: str = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()
    projects: Mapped[List["Project"]] = relationship(back_populates="user")


class Project(Base):
    __tablename__: str = "projects"
    project_id: Mapped[int] = mapped_column(primary_key=True)
    projectName: Mapped[str] = mapped_column()
    businessLogic: Mapped[str] = mapped_column()
    projectUrl: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="projects")
    tests: Mapped[List["Test"]] = relationship(back_populates="project")


class Test(Base):
    __tablename__: str = "tests"
    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.route_id"))
    url_id: Mapped[int] = mapped_column(ForeignKey("url.url_id"))
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.project_id"))
    project: Mapped["Project"] = relationship(back_populates="tests")
    created_at: Mapped[datetime] = mapped_column(default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        default=func.now(), onupdate=func.now()
    )


class Route(Base):
    __tablename__: str = "routes"
    route_id: Mapped[int] = mapped_column(primary_key=True)
    routename: Mapped[str] = mapped_column()


class Url(Base):
    __tablename__: str = "url"
    url_id: Mapped[int] = mapped_column(primary_key=True)
    urlname: Mapped[str] = mapped_column()
