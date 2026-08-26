from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from sqlalchemy import Float, select, DateTime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from contextlib import asynccontextmanager
from datetime import datetime

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
    luminosidade: Mapped[float] = mapped_column(Float)
    data_hora: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now
    )


class LeituraCreate(BaseModel):
    temperatura: float
    umidade_atm: float
    umidade_solo: float
    pressao_atm: float
    luminosidade: float

class LeituraResponse(BaseModel):
    id: int
    temperatura: float
    umidade_atm: float
    umidade_solo: float
    pressao_atm: float
    luminosidade: float
    data_hora: datetime

    model_config = ConfigDict(from_attributes=True)


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


@app.get("/list_leituras", response_model=list[LeituraResponse])
async def listar_leitura():
    async with AsyncSessionLocal() as session:
        resultado = await session.execute(
            select(Leitura)
        )

        leituras = resultado.scalars().all()

        return leituras


@app.get("/leituras/{id}", response_model=LeituraResponse)
async def buscar_leitura(id: int):

    async with AsyncSessionLocal() as session:

        resultado = await session.execute(
            select(Leitura).where(Leitura.id == id)
        )

        leitura = resultado.scalar_one_or_none()

        if leitura is None:
            raise HTTPException(
                status_code=404,
                detail="Leitura não encontrada"
            )

        return leitura


@app.delete("/leituras/{id}")
async def deletar_leitura(id: int):

    async with AsyncSessionLocal() as session:

        resultado = await session.execute(
            select(Leitura).where(Leitura.id == id)
        )

        leitura = resultado.scalar_one_or_none()

        if leitura is None:
            raise HTTPException(
                status_code=404,
                detail="Leitura não encontrada"
            )

        await session.delete(leitura)

        await session.commit()

        return{
            "mensagem": "Leitura deletada com sucesso!"
        }


@app.put("/leituras/{id}", response_model=LeituraResponse)
async def atualizar_leitura(id: int, dados: LeituraCreate):

    async with AsyncSessionLocal() as session:

        resultado = await session.execute(
            select(Leitura).where(Leitura.id == id)
        )

        leitura = resultado.scalar_one_or_none()

        if leitura is None:
            raise HTTPException(
                status_code=404,
                detail="Leitura não encontrada"
            )

        leitura.temperatura = dados.temperatura
        leitura.umidade_atm = dados.umidade_atm
        leitura.umidade_solo = dados.umidade_solo
        leitura.pressao_atm = dados.pressao_atm
        leitura.luminosidade = dados.luminosidade

        await session.commit()

        await session.refresh(leitura)

        return leitura