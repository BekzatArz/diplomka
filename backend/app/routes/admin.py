from flask import Blueprint, request, jsonify
# Импортируй ту модель, которую ты "заселял" в create_app! 
# Если там был User, то и здесь должен быть User.
from app.models import User 
import jwt
import datetime

admin_bp = Blueprint("admin", __name__)
SECRET = "secret123"

@admin_bp.route("/login", methods=["POST"])
def login():
    # Добавим логи для отладки в Render
    print("--- Login Attempt ---")
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    password = data.get("password")
    
    print(f"Checking email: {email}")

    # Ищем пользователя в таблице
    user = User.query.filter_by(email=email).first()

    if not user:
        print("User not found in DB")
        # Меняем 404 на 401, чтобы не путаться
        return jsonify({"error": "Invalid credentials"}), 401
    
    # Проверяем пароль. Убедись, что в модели User есть метод check_password
    # или используй check_password_hash напрямую
    from werkzeug.security import check_password_hash
    if not check_password_hash(user.password, password):
        print("Invalid password")
        return jsonify({"error": "Invalid credentials"}), 401

    # Генерируем токен
    token = jwt.encode({
        "admin_id": user.id,
        "role": user.role, # Берем роль из базы
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET, algorithm="HS256")
    
    print("Login successful, token generated")
    return jsonify({
        "token": token,
        "role": user.role
    })