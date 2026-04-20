import jwt
from flask import request, jsonify

SECRET = "secret123"

def admin_required(func):
    def wrapper(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "No token"}), 401

        try:
            token = token.replace("Bearer ", "")
            data = jwt.decode(token, SECRET, algorithms=["HS256"])

            if data.get("role") != "admin":
                return jsonify({"error": "Not admin"}), 403

        except Exception:
            return jsonify({"error": "Invalid token"}), 401

        return func(*args, **kwargs)

    wrapper.__name__ = func.__name__
    return wrapper