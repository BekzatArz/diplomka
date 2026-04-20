from flask import Blueprint, jsonify, request
from app.models import db, Event, EventContent, Image
from app.utils.auth import admin_required
import json
import os
import uuid
from datetime import datetime

event_bp = Blueprint("event", __name__)
event_bp.strict_slashes = False

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static", "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =========================
# GET ALL Events (публичный)
# =========================
@event_bp.route("/", methods=["GET"])
def get_events():
    events = Event.query.order_by(Event.event_date.asc()).all()

    result = []
    for e in events:
        first_image = EventContent.query.filter_by(event_id=e.id, type="image").first()

        result.append({
            "id": e.id,
            "title": e.title,
            "location": e.location,
            "event_date": e.event_date.isoformat() if e.event_date else None,
            "image_url": first_image.image.url if first_image and first_image.image else None,
            "created_at": e.created_at.isoformat() if e.created_at else None
        })

    return jsonify(result)


# =========================
# GET ONE Event (публичный)
# =========================
@event_bp.route("/<int:id>", methods=["GET"])
def get_event(id):
    event = Event.query.get_or_404(id)

    contents = EventContent.query \
        .filter_by(event_id=id) \
        .order_by(EventContent.position.asc()) \
        .all()

    return jsonify({
        "id": event.id,
        "title": event.title,
        "location": event.location,
        "event_date": event.event_date.isoformat() if event.event_date else None,
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
# CREATE Event (админ)
# =========================
@event_bp.route("/", methods=["POST"])
@admin_required
def create_event():
    try:
        title = request.form.get("title")
        location = request.form.get("location")
        event_date_str = request.form.get("event_date")

        if not title or not location or not event_date_str:
            return jsonify({"error": "Title, location and event_date are required"}), 400

        event_date = datetime.fromisoformat(event_date_str.replace("Z", "+00:00"))

        event = Event(
            title=title,
            location=location,
            event_date=event_date
        )
        db.session.add(event)
        db.session.flush()

        contents = json.loads(request.form.get("contents", "[]"))

        for i, block in enumerate(contents):
            if block.get("type") == "text":
                content = EventContent(
                    event_id=event.id,
                    type="text",
                    text=block.get("text"),
                    position=i
                )
                db.session.add(content)

            elif block.get("type") == "image":
                file = request.files.get(f"image_{i}")
                if file and file.filename:
                    ext = file.filename.rsplit(".", 1)[-1].lower()
                    filename = f"{uuid.uuid4()}.{ext}"
                    filepath = os.path.join(UPLOAD_FOLDER, filename)
                    file.save(filepath)

                    img = Image(url=f"/static/uploads/{filename}")
                    db.session.add(img)
                    db.session.flush()

                    content = EventContent(
                        event_id=event.id,
                        type="image",
                        image_id=img.id,
                        position=i
                    )
                    db.session.add(content)

        db.session.commit()
        return jsonify({"message": "Event created", "id": event.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =========================
# UPDATE Event (админ)
# =========================
@event_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_event(id):
    event = Event.query.get_or_404(id)

    try:
        title = request.form.get("title")
        location = request.form.get("location")
        event_date_str = request.form.get("event_date")

        if title:
            event.title = title
        if location:
            event.location = location
        if event_date_str:
            event.event_date = datetime.fromisoformat(event_date_str.replace("Z", "+00:00"))

        # Обновляем контент
        contents_data = json.loads(request.form.get("contents", "[]"))
        EventContent.query.filter_by(event_id=id).delete()

        for i, block in enumerate(contents_data):
            if block.get("type") == "text":
                content = EventContent(
                    event_id=id,
                    type="text",
                    text=block.get("text"),
                    position=i
                )
                db.session.add(content)

            elif block.get("type") == "image":
                if block.get("isNew"):
                    file = request.files.get(f"image_{block.get('index')}")
                    if file and file.filename:
                        ext = file.filename.rsplit(".", 1)[-1].lower()
                        filename = f"{uuid.uuid4()}.{ext}"
                        filepath = os.path.join(UPLOAD_FOLDER, filename)
                        file.save(filepath)

                        img = Image(url=f"/static/uploads/{filename}")
                        db.session.add(img)
                        db.session.flush()

                        content = EventContent(
                            event_id=id,
                            type="image",
                            image_id=img.id,
                            position=i
                        )
                        db.session.add(content)
                else:
                    # Старое изображение
                    image_url = block.get("image_url")
                    if image_url:
                        existing_image = Image.query.filter_by(url=image_url).first()
                        if existing_image:
                            content = EventContent(
                                event_id=id,
                                type="image",
                                image_id=existing_image.id,
                                position=i
                            )
                            db.session.add(content)

        db.session.commit()
        return jsonify({"message": "Event updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# =========================
# DELETE Event (админ)
# =========================
@event_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_event(id):
    event = Event.query.get_or_404(id)

    try:
        contents = EventContent.query.filter_by(event_id=id).all()

        for content in contents:
            if content.image:
                # Опционально: удаляем файл с диска
                if content.image.url and "/static/uploads/" in content.image.url:
                    file_path = os.path.join(UPLOAD_FOLDER, os.path.basename(content.image.url))
                    if os.path.exists(file_path):
                        os.remove(file_path)
                db.session.delete(content.image)
            db.session.delete(content)

        db.session.delete(event)
        db.session.commit()

        return jsonify({"message": "Event deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500