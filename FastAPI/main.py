from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from fetch_articles import fetch_articles_from_page  # Assuming your fetching script is named fetch_articles.py
from contextlib import contextmanager

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
)


class ArticleBase(BaseModel):
    title: str
    image: str
    body: str
    date: str
    views: int
    description: str


class ArticleModel(ArticleBase):
    id: str
    slug: str

    class Config:
        from_attributes = True


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@contextmanager
def get_db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def check_and_post_articles():
    # Use the session directly within the context manager
    with get_db_session() as db:
        page_number = 1
        articles = fetch_articles_from_page(page_number)
        for article in articles:
            # Check if article already exists
            exists = db.query(models.Article).filter(models.Article.title == article['title']).first() is not None
            print(exists)
            if not exists:
                # Logic to insert a new article into the database
                new_article = models.Article(**article)
                db.add(new_article)
                db.commit()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

# Set up the scheduler
scheduler = AsyncIOScheduler()
# scheduler.start()
@app.on_event("startup")
async def startup_event():
    scheduler.add_job(check_and_post_articles, 'interval', minutes=1, max_instances=1)
    scheduler.start()
    print("Scheduler started")

@app.on_event("shutdown")
def shutdown_event():
    scheduler.shutdown()

@app.post("/articles", response_model=ArticleModel)
async def create_article(article: ArticleBase, db: db_dependency):
    db_article = models.Article(**article.model_dump())
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article


@app.get("/articles", response_model=list[ArticleModel])
async def read_articles(db: db_dependency):
    return db.query(models.Article).all()
