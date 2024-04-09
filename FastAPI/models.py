from database import Base
from sqlalchemy import Column, String, Integer
from slugify import slugify
import uuid

class Article(Base):
    __tablename__ = "articles"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    slug = Column(String, index=True)
    image = Column(String)
    body = Column(String)
    date = Column(String)
    views = Column(Integer)
    description = Column(String)

    def __init__(self, *args, **kwargs):
        kwargs['id'] = str(uuid.uuid4())
        if 'title' in kwargs:
            kwargs['slug'] = slugify(kwargs['title']  + '-' + str(kwargs['id'])[:8])
        super().__init__(*args, **kwargs)
