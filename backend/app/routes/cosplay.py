from flask import Blueprint, request, jsonify
from app.models import Cosplay, Image
from werkzeug.utils import secure_filename
from app.extensions import db
from app.utils.auth import admin_required
import os

cosplay_bp = Blueprint("cosplay", __name__)

# 📁 upload folder
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# 👤 PUBLIC GET (только approved)
@cosplay_bp.route("/public", methods=["GET"])
def get_public():
    cosplays = Cosplay.query.filter_by(status="approved").all()

    return jsonify([
    {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "author_name": c.author_name,
        "image_url": c.image.url if c.image else None,
        "favorite_color": c.favorite_color  # 👈 ДОБАВИЛИ
    }
    for c in cosplays
])


# 👑 ADMIN GET (все)
@cosplay_bp.route("/admin", methods=["GET"])
@admin_required
def get_admin():
    cosplays = Cosplay.query.all()

    return jsonify([
    {
        "id": c.id,
        "title": c.title,
        "description": c.description,
        "author_name": c.author_name,
        "status": c.status,
        "image_url": c.image.url if c.image else None,
        "favorite_color": c.favorite_color  # 👈 ДОБАВИЛИ
    }
    for c in cosplays
])


# ➕ CREATE (гость)
@cosplay_bp.route("/", methods=["POST"])
def create():
    title = request.form.get("title")
    description = request.form.get("description")
    author_name = request.form.get("author_name")
    favorite_color = request.form.get("favorite_color")  # 👈 ДОБАВИЛИ

    image = request.files.get("image")

    image_id = None

    if image:
        filename = secure_filename(image.filename)

        path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(path)

        img = Image(url=f"/static/{filename}")
        db.session.add(img)
        db.session.flush()

        image_id = img.id

    cosplay = Cosplay(
        title=title,
        description=description,
        author_name=author_name,
        favorite_color=favorite_color,  # 👈 ДОБАВИЛИ
        image_id=image_id,
        status="pending"
    )

    db.session.add(cosplay)
    db.session.commit()

    return jsonify({
        "message": "Created",
        "id": cosplay.id
    })


# 👑 APPROVE
@cosplay_bp.route("/<int:id>/approve", methods=["PATCH"])
@admin_required
def approve(id):
    cosplay = Cosplay.query.get_or_404(id)
    cosplay.status = "approved"

    db.session.commit()

    return jsonify({"message": "approved"})


# 👑 DELETE
@cosplay_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete(id):
    cosplay = Cosplay.query.get_or_404(id)

    db.session.delete(cosplay)
    db.session.commit()

    return jsonify({"message": "deleted"})