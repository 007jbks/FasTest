from db import Base
from sqlalchemy.orm import Mapped, mapped_column


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
    user_id: Mapped[int] = mapped_column()
