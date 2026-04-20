from flask import Flask
from app.config import Config
from app.extensions import db, migrate
from flask_cors import CORS

from app.routes.cosplay import cosplay_bp
from app.routes.product import product_bp
from app.routes.admin import admin_bp
from app.routes.article import article_bp
from app.routes.event import event_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://diplomka-umxh.vercel.app"
        ]
    }
})
    
    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        db.create_all() 
    # routes
    app.register_blueprint(admin_bp, url_prefix="/auth")
    app.register_blueprint(cosplay_bp, url_prefix="/cosplay")
    app.register_blueprint(product_bp, url_prefix="/products")
    app.register_blueprint(article_bp, url_prefix="/articles")
    app.register_blueprint(event_bp, url_prefix="/events")


    return app
