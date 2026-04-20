from flask import Blueprint, request, jsonify
from app.models import Admin
import jwt
import datetime

admin_bp = Blueprint("admin", __name__)
SECRET = "secret123"
@admin_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")
    admin = Admin.query.filter_by(email=email).first()

    if not admin:
        return jsonify({"error": "admin not found"}), 404
    if not admin.check_password(password):
        return jsonify({"error": "wrong password"}), 401

    token = jwt.encode({
        "admin_id": admin.id,
        "role": "admin",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET, algorithm="HS256")
    
    return jsonify({"token": token})