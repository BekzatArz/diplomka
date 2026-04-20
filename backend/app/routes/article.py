from flask import Blueprint, jsonify, request
from app.models import db, Article, ArticleContent, Image
from app.utils.auth import admin_required
import json
import os
import uuid

article_bp = Blueprint("article", __name__)
article_bp.strict_slashes = False

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================
# GET ALL (публичный)
# =========================
@article_bp.route("/", methods=["GET"])
def get_articles():
    articles = Article.query.order_by(Article.created_at.desc()).all()

    result = []
    for a in articles:
        # Берём первое изображение для превью
        first_image = ArticleContent.query.filter_by(
            article_id=a.id, type="image"
        ).first()

        result.append({
            "id": a.id,
            "title": a.title,
            "image_url": first_image.image.url if first_image and first_image.image else None,
            "created_at": a.created_at.isoformat() if a.created_at else None
        })

    return jsonify(result)


# =========================
# GET ONE (публичный)
# =========================
@article_bp.route("/<int:id>", methods=["GET"])
def get_article(id):
    article = Article.query.get_or_404(id)

    contents = ArticleContent.query \
        .filter_by(article_id=id) \
        .order_by(ArticleContent.position.asc()) \
        .all()

    return jsonify({
        "id": article.id,
        "title": article.title,
        "contents": [
            {
                "type": c.type,
                "text": c.text,
                "image_url": c.image.url if c.image else None
            }
            for c in contents
        ]
    })


# =========================
# CREATE (админ) — уже хороший, но немного улучшил
# =========================
@article_bp.route("/", methods=["POST"])
@admin_required
def create_article():
    try:
        title = request.form.get("title")
        if not title:
            return jsonify({"error": "Title is required"}), 400

        contents = json.loads(request.form.get("contents", "[]"))

        article = Article(title=title)
        db.session.add(article)
        db.session.flush()  # чтобы получить article.id

        for i, block in enumerate(contents):
            if block.get("type") == "text":
                content = ArticleContent(
                    article_id=article.id,
                    type="text",
                    text=block.get("text"),
                    position=i
                )
                db.session.add(content)

            elif block.get("type") == "image":
                file_key = f"image_{i}"
                file = request.files.get(file_key)

                if not file or not file.filename:
                    continue  # пропускаем пустые изображения

                # Генерируем уникальное имя
                ext = file.filename.rsplit(".", 1)[-1].lower()
                filename = f"{uuid.uuid4()}.{ext}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)

                # Создаём запись Image
                img = Image(url=f"/static/uploads/{filename}")
                db.session.add(img)
                db.session.flush()

                content = ArticleContent(
                    article_id=article.id,
                    type="image",
                    image_id=img.id,
                    position=i
                )
                db.session.add(content)

        db.session.commit()
        return jsonify({"message": "Article created", "id": article.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =========================
# UPDATE (админ) — полностью переписал под загрузку файлов
# =========================
@article_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_article(id):
    article = Article.query.get_or_404(id)

    try:
        title = request.form.get("title")
        if title:
            article.title = title

        # Получаем новый contents из JSON
        contents_data = json.loads(request.form.get("contents", "[]"))

        # Удаляем все старые ArticleContent для этой статьи
        ArticleContent.query.filter_by(article_id=id).delete()

        for i, block in enumerate(contents_data):
            if block.get("type") == "text":
                content = ArticleContent(
                    article_id=id,
                    type="text",
                    text=block.get("text"),
                    position=i
                )
                db.session.add(content)

            elif block.get("type") == "image":
                if block.get("isNew") is True:
                    # Новое загруженное изображение
                    file_key = f"image_{block.get('index')}"
                    file = request.files.get(file_key)

                    if file and file.filename:
                        ext = file.filename.rsplit(".", 1)[-1].lower()
                        filename = f"{uuid.uuid4()}.{ext}"
                        filepath = os.path.join(UPLOAD_FOLDER, filename)
                        file.save(filepath)

                        img = Image(url=f"/static/uploads/{filename}")
                        db.session.add(img)
                        db.session.flush()

                        content = ArticleContent(
                            article_id=id,
                            type="image",
                            image_id=img.id,
                            position=i
                        )
                        db.session.add(content)
                else:
                    # Старое изображение — просто восстанавливаем по image_url
                    image_url = block.get("image_url")
                    if image_url:
                        # Находим существующее изображение по url
                        existing_image = Image.query.filter_by(url=image_url).first()
                        if existing_image:
                            content = ArticleContent(
                                article_id=id,
                                type="image",
                                image_id=existing_image.id,
                                position=i
                            )
                            db.session.add(content)

        db.session.commit()
        return jsonify({"message": "Article updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =========================
# DELETE (админ) — исправлено
# =========================
@article_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_article(id):
    article = Article.query.get_or_404(id)

    try:
        # Удаляем все связанные ArticleContent и их изображения
        contents = ArticleContent.query.filter_by(article_id=id).all()

        for content in contents:
            if content.image:
                # Удаляем файл с диска (опционально)
                if content.image.url and content.image.url.startswith("/static/uploads/"):
                    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(content.image.url))
                    if os.path.exists(file_path):
                        os.remove(file_path)
                db.session.delete(content.image)
            db.session.delete(content)

        db.session.delete(article)
        db.session.commit()

        return jsonify({"message": "Article deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500