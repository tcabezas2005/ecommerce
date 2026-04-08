from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, schemas, crud

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/products")
def create(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    return crud.create_product(db, product)

@app.get("/products")
def read(db: Session = Depends(get_db)):
    return crud.get_products(db)

@app.get("/products/{id}")
def read_one(id: int, db: Session = Depends(get_db)):
    return crud.get_product(db, id)

@app.delete("/products/{id}")
def delete(id: int, db: Session = Depends(get_db)):
    return crud.delete_product(db, id)