# Import the Flask class from the flask module
from flask import Flask, request, jsonify, send_file
from flask_pymongo import PyMongo
from flask_cors import CORS
import jwt
import bcrypt
import datetime
from dotenv import load_dotenv
import os
from bson import ObjectId
import gridfs
from io import BytesIO

import requests
from Crypto.Cipher import AES
import hashlib
from Crypto.Util.Padding import pad, unpad
import base64
import logging

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "https://localhost:5173"}}) #support credentials es per les cookies
app.config["MONGO_URI"] = "mongodb://localhost:27017/VirtualCampus"

mongo = PyMongo(app)
fs = gridfs.GridFS(mongo.db)

load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")

API_KEY = os.getenv("API_KEY")
SECRET_ENCRYPTION_KEY = os.getenv("SECRET_ENCRYPTION_KEY")

key = hashlib.sha256(SECRET_ENCRYPTION_KEY.encode()).digest()[:16]
logger = logging.getLogger(__name__)
logging.basicConfig(filename='logging.log', format='%(levelname)s:%(message)   s%(asctime)s', encoding='utf-8', filemode='w', level=logging.DEBUG)

def encrypt_ecb(text):
    cipher = AES.new(key, AES.MODE_ECB)
    padded_message = pad(text.encode(), AES.block_size)
    encrypted_message = cipher.encrypt(padded_message)
    encrypted_message_string = base64.b64encode(encrypted_message).decode('utf-8')
    return encrypted_message_string

def decrypt_ecb(text):
    # Ensure text is decoded from base64 and converted to bytes
    encrypted_message = base64.b64decode(text)
    
    cipher = AES.new(key, AES.MODE_ECB)
    decrypted_padded_message = cipher.decrypt(encrypted_message)
    plaintext = unpad(decrypted_padded_message, AES.block_size).decode('utf-8')
    return plaintext

# Define a route and a function to handle requests to that route
@app.route('/')
def hello_world():
    mongo.db.inventory.insert_one({'a':2})
    return 'Hello, Flask World!'

@app.route('/verifyToken', methods=["POST"])
def verify_token():
    token = request.get_json()
    if not token:
        return jsonify({"message": "Token is missing"}), 403

    try:
        data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        m = mongo.db.users.find_one({'email': data.get('email')})
        print(m)
        return jsonify({
            "message": "Token is valid",
            "email": data.get('email'),
            "admin": m.get('admin')
        })
    
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 403
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 403

@app.route('/signup', methods=["POST"])
def register_user():
    data = request.get_json()
    m = mongo.db.users.find_one({'email':encrypt_ecb(data.get('email'))})
    if m is None:
        user = mongo.db.users.insert_one({
            'email': encrypt_ecb(data.get('email')),
            'username': (data.get('username')),
            'password': data.get('password'),
            'admin': False
        })
        logger.debug('%s User has been created.', data.get('email'))
        token = jwt.encode({
            'user_id': str(user.inserted_id),
            'email': encrypt_ecb(data.get('email')),
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
            },
            "token": token
        })

        return response

    else:
        return jsonify({
            "status": "error",
            "message": "Email already exists or something went wrong"
        }), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = mongo.db.users.find_one({'email': encrypt_ecb(email)})  
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
        'email':  encrypt_ecb(email),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)  # Token expiration
    }, SECRET_KEY, algorithm='HS256')

    logger.debug('%s Login Successful.', data.get('email'))
    # Prepare response
    response = jsonify({
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": str(user['_id']),  # Returning the user's ID as a string
            "email": email,
            "username": user['username'],
            "admin": user['admin']
        },
        "token":token
    })
    response.set_cookie('token', token)

    return response

@app.route('/takeStudents', methods=['GET'])
def students():
    students_cursor = mongo.db.users.find({'admin': False})
    students = list(students_cursor) 
    emails = [decrypt_ecb(student.get('email')) for student in students] 
    print(emails)
    if students:  
        response = jsonify({
            "status": "success",
            "message": "Students retrieved successfully",
            "emails": emails 
        })
        return response
    else:
        return jsonify({
            "status": "error",
            "message": "No users found"
        }), 400
    
@app.route('/addClass', methods=['POST'])
def addClass():
    data = request.get_json()
    students = list(data.get('students')) 
    students = [encrypt_ecb(student) for student in students] 
    m = mongo.db.classes.find_one({'className':data.get('className')})
    if m is None:
        classs = mongo.db.classes.insert_one({
            'teacherEmail': data.get('emailTeacher'),
            'className': data.get('className'),
            'students': students,
        })
        logger.debug('%s Class has been created.', data.get('className'))
        return jsonify({
            "status": "success",
            "message": "Class registered successfully",
        })
    else:
        return jsonify({
            "status": "error",
            'message': 'class with that name already exists'
        }),400

@app.route('/getClasses', methods=['POST'])
def getClasses():
    data = request.get_json()
    if(data.get('admin')):
        getClasses = mongo.db.classes.find({'teacherEmail': data.get('email')})
        classes = list(getClasses)
        for cls in classes:
            cls['_id'] = str(cls['_id'])
        return jsonify({
            "status": "success",
            "message": "Classes of the teacher had been send successfully",
            "classes": classes
        })
    else:
        getClasses = mongo.db.classes.find({'students': data.get('email')})
        classes = list(getClasses)
        for cls in classes:
            cls['_id'] = str(cls['_id'])
        return jsonify({
            "status": "success",
            "message": "Classes of the student had been send successfully",
            "classes": classes
        })

def checkFile(fileName):
    url = "https://www.virustotal.com/api/v3/files"

    files = {'file': fileName}
    headers = {
        "accept": "application/json",
        "x-apikey": API_KEY,
    }
    response = requests.post(url, files=files, headers=headers)
    if response.status_code == 200:
        data = response.json()
        print(data)
        id = data.get('data', False).get('id', False)
        if id:
            return id, 200
    return 0, 400

def getFileReport(id):
    headers = {
        "accept": "application/json",
        "x-apikey": API_KEY,
    }
    url = "https://www.virustotal.com/api/v3/analyses" + '/' + str(id)
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        stats = data.get('data', False).get('attributes', False).get('stats', False)
        print(stats)
        if stats:
            keys_to_check = ['malicious', 'suspicious', 'timeout', 'confirmed-timeout', 'failure']
            no_error = all(stats.get(key, False) == 0 for key in keys_to_check)
            if no_error:
                return 200
    return 400

@app.route('/uploadLesson', methods=['POST'])
def addLesson():
    lesson_name = request.form.get('lessonName') 
    class_name = request.form.get('className') 
    
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    virustotalId, status_code = checkFile(file)
    if status_code == 200:
        report = getFileReport(virustotalId)
        if report == 400:
            return jsonify({"error": "Have been an error uploading the file. Try it again or contact your administrator."}), 400
    else:
        return jsonify({"error": "Have been an error uploading the file. Try it again or contact your administrator."}), 400
    
    file_id = fs.put(file, filename=file.filename)

    class_doc = mongo.db.classes.find_one({'className': class_name})
    
    if class_doc is None:
        return jsonify({"error": "Class not found"}), 404

    lesson = {
        'lesson_name': lesson_name,
        'file_id': str(file_id), 
        'filename': file.filename
    }

    mongo.db.classes.update_one(
        {'_id': class_doc['_id']},
        {'$push': {'lessons': lesson}}  
    )

    return jsonify({
        "status": "success",
        "message": "Lesson has been saved successfully",
        "file_id": str(file_id)
    })

@app.route('/getLesson/<file_id>', methods=['GET'])
def get_lesson(file_id):

    file_data = fs.find_one({"_id": ObjectId(file_id)})

    if not file_data:
        return jsonify({"error": "File not found"}), 404

    file_stream = BytesIO(file_data.read()) 

    return send_file(
        file_stream,
        as_attachment=True,
        download_name=file_data.filename,
        mimetype='application/pdf'  
    )

@app.route('/getClass', methods=['POST'])
def get_class():
    data = request.get_json()
    if data.get('className'):
        cls = mongo.db.classes.find_one({'className': data.get('className')})
        students = list(cls.get('students')) 
        students = [decrypt_ecb(student) for student in students] 
        cls['students'] = students
        if cls:
            cls['_id'] = str(cls['_id'])  
            return jsonify({
                "status": "success",
                "message": "Class of the teacher has been sent successfully",
                "class": cls
            })
        else:
            return jsonify({
                "status": "error",
                "message": "Class not found"
            }), 404
    else:
        return jsonify({
            "status": "error",
            "message": "Invalid input"
        }), 400

@app.route('/deleteStudent', methods=['POST'])
def delete_student():
    data = request.get_json()
    student = encrypt_ecb(data.get("student"));
    result = mongo.db.classes.update_one(
        {'className': data.get("className"), 'students': student},
        {'$pull': {'students': student}}
    )
    
    if result.modified_count > 0:
        logger.debug('%s Student has been deleted.', data.get('student'))
        return jsonify({
            "status": "success",
            "message": f"Student {data.get('student')} has been removed from the class successfully",
        })
    else:
        return jsonify({
            "status": "error",
            "message": "Student not found or already removed",
        }), 404

@app.route('/deleteClass', methods=['POST'])
def delete_class():
    data = request.get_json()

    result = mongo.db.classes.delete_one(
        {'className': data.get("className")}
    )
    logger.debug('%s Class has been deleted.', data.get("className"))
    return jsonify({
            "status": "success",
            "message": f"Student {data.get('student')} has been removed from the class successfully",
        })

@app.route('/deleteLesson', methods=['POST'])
def delete_lesson():
    try:
        data = request.get_json()
        class_name = data.get('className')
        file_id_str = data.get('file')['file_id']
        
        print(f"Class Name: {class_name}")
        print(f"File ID to delete: {file_id_str}")

        # Convert file_id to ObjectId
        file_id = ObjectId(file_id_str)

        # Step 1: Remove the lesson from the `lessons` array in the `classes` collection
        result = mongo.db.classes.update_one(
            { "className": class_name },
            { "$pull": { "lessons": { "file_id": file_id_str } } }
        )

        # Debugging output for update
        if result.modified_count > 0:
            print("Lesson removed from class.")

        # Step 2: Delete the file from GridFS (both metadata and data chunks)
        file_delete_result = mongo.db.fs.files.delete_one({ "_id": file_id })
        chunks_delete_result = mongo.db.fs.chunks.delete_many({ "files_id": file_id })

        # Debugging output for file deletion
        print(f"Deleted file: {file_delete_result.deleted_count}")
        print(f"Deleted chunks: {chunks_delete_result.deleted_count}")

        logger.debug('Lesson with file ID %s has been removed successfully', file_id_str)
        return jsonify({
            "status": "success",
            "message": f"Lesson with file ID {file_id_str} has been removed successfully",
        }), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500
    
    
# Run the application
if __name__ == '__main__':
    app.run(debug=True)