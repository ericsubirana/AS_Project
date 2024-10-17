# Import the Flask class from the flask module
from flask import Flask, request, jsonify, session, make_response
from flask_pymongo import PyMongo
from flask_cors import CORS
import jwt
import bcrypt
import datetime
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:5173"}}) #support credentials es per les cookies
app.config["MONGO_URI"] = "mongodb://localhost:27017/VirtualCampus"

mongo = PyMongo(app)

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

# Define a route and a function to handle requests to that route
@app.route('/')
def hello_world():
    mongo.db.inventory.insert_one({'a':2})
    return 'Hello, Flask World!'

@app.route('/verifyToken', methods=["GET"])
def verify_token():
    token = request.cookies.get('token') 
    if not token:
        return jsonify({"message": "Token is missing"}), 403

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])

        return jsonify({
            "message": "Token is valid",
            "email": data['email'],
            "admin": m.get('admin')
        })
    
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 403

@app.route('/signup', methods=["POST"])
def register_user():
    data = request.get_json()
    m = mongo.db.users.find_one({'email':data.get('email')})
    if m is None:
        user = mongo.db.users.insert_one({
            'email': data.get('email'),
            'username': data.get('username'),
            'password': data.get('password'),
            'admin': False
        })

        token = jwt.encode({
            'user_id': str(user.inserted_id),
            'email': data.get('email'),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration
        }, SECRET_KEY, algorithm='HS256')

        response = jsonify({
            "status": "success",
            "message": "User registered successfully",
            "user": {
                "id": str(user.inserted_id),  # Returning the inserted user's ID as a string
                "email": data.get('email'),
                "username": data.get('username'),
                "admin": False
            }
        })
        response.set_cookie('token', token)

        return response

    else:
        return jsonify({
            "status": "error",
            "message": "Email already exists"
        }), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': email})  
    if not user:
        return jsonify({
            "status": "error",
            "message": "User not found"
        }), 404  # Not Found

    # Compare the password (ja que al afegit-li salt canvia tot el rato)
    if not bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        return jsonify({
            "status": "error",
            "message": "Incorrect password"
        }), 400  # Bad Request

    # Create JWT token
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user['email'],
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration
    }, SECRET_KEY, algorithm='HS256')

    # Prepare response
    response = jsonify({
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": str(user['_id']),  # Returning the user's ID as a string
            "email": email,
            "username": user['username'],
            "admin": user['admin']
        }
    })
    response.set_cookie('token', token)

    return response


# Run the application
if __name__ == '__main__':
    app.run(debug=True)