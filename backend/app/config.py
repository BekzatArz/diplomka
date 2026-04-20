import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    uri = os.getenv("DATABASE_URL")

    # фикс для Render (postgres:// → postgresql://)
    if uri and uri.startswith("postgres://"):
        uri = uri.replace("postgres://", "postgresql://", 1)

    SQLALCHEMY_DATABASE_URI = uri

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")