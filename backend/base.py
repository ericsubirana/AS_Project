# Import the Flask class from the flask module
from flask import Flask

# Create an instance of the Flask class
app = Flask(__name__)

# Define a route and a function to handle requests to that route
@app.route('/')
def hello_world():
    return 'Hello, Flask World!'

@app.route('/profile')
def my_profile():
    response_body = {
        "name": "Victor",
        "about" :"TEST"
    }

    return response_body
# Run the application
if __name__ == '__main__':
    app.run(debug=True)