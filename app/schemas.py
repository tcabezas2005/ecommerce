from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    stock: int
    image_url: str | None = None
    category: str

class ProductResponse(ProductCreate):
    id: int

    class Config:
        from_attributes = True