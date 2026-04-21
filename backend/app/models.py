from app.extensions import db
from datetime import datetime
import pytz
import bcrypt

# 🇰🇬 Kyrgyzstan timezone
KZ_TZ = pytz.timezone("Asia/Bishkek")

def now_kz():
    return datetime.now(KZ_TZ)

from app.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Длина 255 важна для хеша
    role = db.Column(db.String(20), default='user')      # 'admin' или 'user'

    def __repr__(self):
        return f'<User {self.email}>'

# 🖼 IMAGE
class Image(db.Model):
    __tablename__ = "images"

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=now_kz)


# 🎭 COSPLAY
class Cosplay(db.Model):
    __tablename__ = "cosplays"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)

    image_id = db.Column(db.Integer, db.ForeignKey("images.id"))
    image = db.relationship("Image")
    favorite_color = db.Column(db.String(20), nullable=True)

    author_name = db.Column(db.String(100), nullable=True)

    status = db.Column(db.String(20), default="pending")

    created_at = db.Column(db.DateTime, default=now_kz)


# 🛒 PRODUCT
class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)

    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)

    price = db.Column(db.Integer, nullable=False)

    image_id = db.Column(db.Integer, db.ForeignKey("images.id"))
    image = db.relationship("Image")

    # 👤 продавец (простые поля)
    seller_phone = db.Column(db.String(50), nullable=True)
    seller_instagram = db.Column(db.String(255), nullable=True)

    created_at = db.Column(db.DateTime, default=now_kz)

# 📰 ARTICLE
# 📰 ARTICLE
class Article(db.Model):
    __tablename__ = "articles"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    created_at = db.Column(db.DateTime, default=now_kz)

    # ✅ Правильная связь с контентом (это было нужно!)
    contents = db.relationship(
        "ArticleContent",
        backref="article",
        cascade="all, delete-orphan",   # автоматически удаляет контент при удалении статьи
        lazy="select",
        order_by="ArticleContent.position"
    )

    # Опционально: главное изображение статьи (для превью)
    main_image_id = db.Column(db.Integer, db.ForeignKey("images.id"), nullable=True)
    main_image = db.relationship("Image", foreign_keys=[main_image_id])

class ArticleContent(db.Model):
    __tablename__ = "article_contents"

    id = db.Column(db.Integer, primary_key=True)

    article_id = db.Column(db.Integer, db.ForeignKey("articles.id"), nullable=False)

    type = db.Column(db.String(20), nullable=False)  
    # "text" | "image"

    text = db.Column(db.Text, nullable=True)

    image_id = db.Column(db.Integer, db.ForeignKey("images.id"))
    image = db.relationship("Image")

    position = db.Column(db.Integer, default=0)

# 🎪 EVENT
# 🎪 EVENT — Полная версия с контентом (как Article)
class Event(db.Model):
    __tablename__ = "events"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(300), nullable=False)
    location = db.Column(db.String(300), nullable=False)
    event_date = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime, default=now_kz)

    # Связь с контентом (текст + изображения)
    contents = db.relationship(
        "EventContent",
        backref="event",
        cascade="all, delete-orphan",
        lazy="select",
        order_by="EventContent.position"
    )

    # Главное изображение для превью (опционально)
    main_image_id = db.Column(db.Integer, db.ForeignKey("images.id"), nullable=True)
    main_image = db.relationship("Image", foreign_keys=[main_image_id])


class EventContent(db.Model):
    __tablename__ = "event_contents"

    id = db.Column(db.Integer, primary_key=True)

    event_id = db.Column(db.Integer, db.ForeignKey("events.id"), nullable=False)

    type = db.Column(db.String(20), nullable=False)   # "text" | "image"
    text = db.Column(db.Text, nullable=True)

    image_id = db.Column(db.Integer, db.ForeignKey("images.id"), nullable=True)
    image = db.relationship("Image", foreign_keys=[image_id])

    position = db.Column(db.Integer, default=0, nullable=False)

    __table_args__ = (
        db.Index('ix_event_content_event_id', 'event_id'),
    )

# 👑 ADMIN
class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    created_at = db.Column(db.DateTime, default=now_kz)

    def set_password(self, password):
        salt = bcrypt.gensalt()
        self.password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            salt
        ).decode("utf-8")

    def check_password(self, password):
        return bcrypt.checkpw(
            password.encode("utf-8"),
            self.password_hash.encode("utf-8")
        )