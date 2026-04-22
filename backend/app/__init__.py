from flask import Flask
from app.config import Config
from app.extensions import db, migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash # Импортируем хеширование

from app.routes.cosplay import cosplay_bp
from app.routes.product import product_bp
from app.routes.admin import admin_bp
from app.routes.article import article_bp
from app.routes.event import event_bp

# Импортируй свою модель User. Путь может отличаться в зависимости от твоей структуры
from app.models import User 

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000",
                "https://diplom-frontend-gamma.vercel.app"
            ]
        }
    })
    
    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        db.create_all() 
        
        # --- ЛОГИКА АВТО-СОЗДАНИЯ АДМИНА ---
        admin_email = "admin@test.com"
        # Проверяем, существует ли уже админ
        existing_admin = User.query.filter_by(email=admin_email).first()
        
        if not existing_admin:
            print("База пуста. Создаю системного администратора...")
            hashed_password = generate_password_hash("123456")
            new_admin = User(
                email=admin_email,
                password=hashed_password,
                role="admin" # Тот самый флаг, который проверяет твой декоратор
            )
            db.session.add(new_admin)
            db.session.commit()
            print("Админ успешно создан.")
        # ----------------------------------

    # routes
    app.register_blueprint(admin_bp, url_prefix="/auth")
    app.register_blueprint(cosplay_bp, url_prefix="/cosplay")
    app.register_blueprint(product_bp, url_prefix="/products")
    app.register_blueprint(article_bp, url_prefix="/articles")
    app.register_blueprint(event_bp, url_prefix="/events")
    print(app.url_map)
    return app