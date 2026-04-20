from flask import Blueprint, jsonify, request
from app.models import Product, db, Image
from app.utils.auth import admin_required
from werkzeug.utils import secure_filename
import os
import uuid

product_bp = Blueprint("product", __name__)
product_bp.strict_slashes = False

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "static")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
# GET ALL
@product_bp.route("/", methods=["GET"])
def get_products():
    products = Product.query.all()

    return jsonify([
        {
            "id": p.id,
            "title": p.title,
            "description": p.description,
            "price": p.price,
            "image_url": p.image.url if p.image else None,

            # 👇 seller data
            "seller_phone": p.seller_phone,
            "seller_instagram": p.seller_instagram,
        }
        for p in products
    ])


# CREATE
@product_bp.route("/", methods=["POST"])
@admin_required
def create_product():
    title = request.form.get("title")
    description = request.form.get("description")
    price = request.form.get("price")
    seller_phone = request.form.get("seller_phone")
    seller_instagram = request.form.get("seller_instagram")

    image = request.files.get("image")

    image_id = None

    if image:
        ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"

        path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(path)

        img = Image(url=f"/static/{filename}")
        db.session.add(img)
        db.session.flush()

        image_id = img.id

    product = Product(
        title=title,
        description=description,
        price=float(price) if price else 0,
        seller_phone=seller_phone,
        seller_instagram=seller_instagram,
        image_id=image_id
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({
        "message": "created",
        "id": product.id
    })

# UPDATE
@product_bp.route("/<int:id>", methods=["PUT"])
@admin_required
def update_product(id):
    product = Product.query.get_or_404(id)

    data = request.form

    product.title = data.get("title", product.title)
    product.description = data.get("description", product.description)
    product.price = float(data.get("price", product.price))

    product.seller_phone = data.get("seller_phone", product.seller_phone)
    product.seller_instagram = data.get("seller_instagram", product.seller_instagram)

    image = request.files.get("image")

    if image:
        ext = image.filename.split(".")[-1]
        filename = f"{uuid.uuid4()}.{ext}"

        path = os.path.join(UPLOAD_FOLDER, filename)
        image.save(path)

        img = Image(url=f"/static/{filename}")
        db.session.add(img)
        db.session.flush()

        product.image_id = img.id

    db.session.commit()

    return jsonify({"message": "updated"})
# DELETE
@product_bp.route("/<int:id>", methods=["DELETE"])
@admin_required
def delete_product(id):
    product = Product.query.get_or_404(id)

    db.session.delete(product)
    db.session.commit()

    return jsonify({"message": "deleted"})