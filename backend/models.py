from db import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import ForeignKey, func
from datetime import datetime


class User(Base):
    __tablename__: str = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column(unique=True)
    password: Mapped[str] = mapped_column()


class Test(Base):
    __tablename__: str = "tests"
    id: Mapped[int] = mapped_column(primary_key=True)
    body: Mapped[str] = mapped_column()
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.route_id"))
    url_id: Mapped[int] = mapped_column(ForeignKey("url.url_id"))
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
