from fastapi import FastAPI
from pydantic import BaseModel, Field
import asyncpg

app = FastAPI()


async def get_db_connection():
    return await asyncpg.connect(
        user="postgres",
        password="admin",
        database="Sistema Metereológico",
        host="localhost"
    )


class Leitura(BaseModel):
    temperatura: float
    umidade: float
    umidade_solo: float
    pressao: float
    chuva_mm: float


@app.get("/Status")
async def root():
    return {
        "mensagem": "API da Estação Meteorológica funcionando!"
    }

@app.get("/test")
async def test_connection():
    conn = await get_db_connection()
    await conn.close()
    return {"message": "Conexão com o PostgreSQL bem-sucedida!"}


@app.get("/leituras")
async def get_leituras():
    conn = await get_db_connection()
    rows = await conn.fetch("SELECT * FROM leituras")
    await conn.close()
    leituras = []

    for row in rows:
        leituras.append(
            f"ID: {row['id']} | "
            f"Temperatura: {row['temperatura']} °C | "
            f"Umidade: {row['umidade']}% | "
            f"Umidade do solo: {row['umidade_solo']}% | "
            f"Pressão: {row['pressao']} hPa | "
            f"Chuva: {row['chuva_mm']} mm | "
            f"Data: {row['data_hora']}"
        )

    return {"leituras": leituras}