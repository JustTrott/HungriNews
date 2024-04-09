from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from fetch_articles import fetch_articles_from_page, fetch_article_details  # Assuming your fetching script is named fetch_articles.py
from contextlib import contextmanager
from datetime import datetime, timedelta

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
        for article, link in articles:
            # Check if article already exists
            exists = db.query(models.Article).filter(models.Article.title == article['title']).first() is not None
            if not exists:
                # Logic to insert a new article into the database
                article = fetch_article_details(article, link)
                new_article = models.Article(**article)
                db.add(new_article)
                db.commit()
                print(f"Added article: {article['title']}")


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)

# Set up the scheduler
scheduler = AsyncIOScheduler()
# scheduler.start()
@app.on_event("startup")
async def startup_event():
    job = scheduler.add_job(
        check_and_post_articles,
        trigger=IntervalTrigger(minutes=5)
    )
    
    # Run the job immediately as well
    await job.func(*job.args, **job.kwargs)

    scheduler.start()
    print("Scheduler started, first job execution triggered immediately.")

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

@app.post("/article/{article_id}", response_model=ArticleModel)
async def increment_article_views(article_id: str, db: db_dependency):
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    db_article.views += 1
    db.commit()
    db.refresh(db_article)
    return db_article

@app.get("/article/{article_id}/views", response_model=dict)
async def get_article_views(article_id: str, db: db_dependency):
    db_article = db.query(models.Article).filter(models.Article.id == article_id).first()
    if db_article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"views": db_article.views}