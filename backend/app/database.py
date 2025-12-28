import os
from dotenv import load_dotenv

load_dotenv()   # ✅ MUST be before os.getenv()

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#DATABASE_URL = os.getenv("DATABASE_URL")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'healthmubarak.db')}"

print("DATABASE URL IN USE:", DATABASE_URL)
print("📌 DATABASE FILE PATH:", os.path.abspath(os.path.join(BASE_DIR, 'healthmubarak.db')))

if not DATABASE_URL:
    raise Exception("DATABASE_URL not set")

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
