from fastapi import FastAPI
from pydantic import BaseModel, Field
from sqlalchemy import Float, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from contextlib import asynccontextmanager

DATABASE_URL = "postgresql+asyncpg://postgres:%23Ngpc2008@localhost:5432/Estacao-meteorologica"

engine = create_async_engine(
    DATABASE_URL,
    echo=True
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    pass


class Leitura(Base):
    __tablename__ = "leituras"
    
    id: Mapped[int] = mapped_column(
        primary_key=True,
        autoincrement=True
    )

    temperatura: Mapped[float] = mapped_column(Float)
    umidade_atm: Mapped[float] = mapped_column(Float)
    umidade_solo: Mapped[float] = mapped_column(Float)
    pressao_atm: Mapped[float] = mapped_column(Float)
    luminosidade    : Mapped[float] = mapped_column(Float)


class LeituraCreate(BaseModel):
    temperatura: float
    umidade_atm: float
    umidade_solo: float
    pressao_atm: float
    luminosidade: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    yield

    await engine.dispose()


app = FastAPI(lifespan=lifespan)


@app.post("/leituras")
async def criar_leitura(leitura: LeituraCreate):
    async with AsyncSessionLocal() as session:
        nova_leitura = Leitura(
            temperatura=leitura.temperatura,
            umidade_atm=leitura.umidade_atm,
            umidade_solo=leitura.umidade_solo,
            pressao_atm=leitura.pressao_atm,
            luminosidade=leitura.luminosidade
        )

        session.add(nova_leitura)

        await session.commit()

        await session.refresh(nova_leitura)

        return nova_leitura


@app.get("/list_leituras")
async def listar_leitura():
    async with AsyncSessionLocal() as session:
        resultado = await session.execute(
            select(Leitura)
        )

        leituras = resultado.scalars().all

        return leituras