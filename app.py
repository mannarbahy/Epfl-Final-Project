import bcrypt
import uuid
import json
from flask import Flask, redirect, request, session, render_template, flash, url_for, jsonify
from flask_session import Session
from email_validator import validate_email, EmailNotValidError
from datetime import datetime
import os

app = Flask(__name__, template_folder="templates")
app.secret_key = 'your_secret_key'

class User:
    def __init__(self, name, email, password, address, phone,security_question):
        self.name = name
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone
        self.security_question = security_question
        self.id = uuid.uuid4()
        self.wishlist = []  
        self.cart = {}      
        self.orders = []

    def hash_password(self):
        return bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())

    def format_data(self, hashed_password):
        users_list = []
        data = {
            "name": self.name,
            "email": self.email,
            "id": str(self.id),
            "password": hashed_password.decode('utf-8'),
            "address": self.address,
            "phone": self.phone,
            "security_question": self.security_question,
            "wishlist": self.wishlist,  
            "cart": self.cart,          
            "orders": self.orders
        }
        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            pass

        users_list.append(data)
        with open("usersDB.json", "w") as file:
            json.dump(users_list, file, indent=4)

    @staticmethod
    def update_user_data(user_id, updated_data):
        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if user['id'] == user_id:
                    user.update(updated_data)
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)
        except Exception as e:
            raise Exception("Error updating user data:", str(e))

    def __init__(self, name, email, password,address, phone,security_question):
        self.name = name
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone
        self.id = uuid.uuid4()
        self.security_question = security_question

    def hash_password(self):
        return bcrypt.hashpw(self.password.encode('utf-8'), bcrypt.gensalt())

    def format_data(self, hashed_password):
        users_list = []
        data = {
            "name": self.name,
            "email": self.email,
            "id": str(self.id),
            "password": hashed_password.decode('utf-8'),
            "address": self.address,
            "phone": self.phone,
            "security_question": self.security_question,
            "wishlist": [], 
            "cart": {},
            "orders": []
        }
        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)
        except (FileNotFoundError, json.JSONDecodeError):
            pass

        users_list.append(data)
        with open("usersDB.json", "w") as file:
            json.dump(users_list, file, indent=4)

def email_validation(email):
    try:
        email_info = validate_email(email, check_deliverability=False)
        return [True, email_info.normalized]
    except EmailNotValidError as e:
        return [False, str(e)]
def check_password(user_password, hash):
    user_bytes = user_password.encode('utf-8') 
    saved_password = hash.encode('utf-8')
    result = bcrypt.checkpw(user_bytes, saved_password) 
    return result


@app.route('/')
def index():
    return "Welcome to the Flask App!"

@app.route('/home')
def home():
    if 'user' in session:
        return render_template('home.html')
    return redirect('/login')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        name = request.form.get('fullname')
        email = request.form.get('email')
        password = request.form.get('password')
        address = request.form.get('address')
        phone = request.form.get('phone')
        security_question = request.form.get('security_question')

        if not email or not password or not name:
            return render_template('signup.html', error='Please enter email, password, and username')

        email_valid = email_validation(email)
        if not email_valid[0]:
            return render_template('signup.html', error=email_valid[1])

        email = email_valid[1]

        userdb_path = 'usersDB.json'
        if os.path.exists(userdb_path):
            with open(userdb_path, 'r') as file:
                userdb = json.load(file)
        else:
            userdb = []

        if any(user['email'] == email for user in userdb):
            return jsonify({"error": 'Email already exists! Please use a different email.'}), 400

        new_user = User(name, email, password,address, phone,security_question)
        hashed_password = new_user.hash_password()
        new_user.format_data(hashed_password)

        session['user'] = str(new_user.id)
        return jsonify({
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "address": new_user.address,
            "phone": new_user.phone
        }), 201
    
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        users_list = []
        with open('usersDB.json') as file:
            users_list = json.load(file)

        if not email or not password:
            return render_template('login.html', error='Please enter email and password') 
        
        email_valid = email_validation(email)
        if not email_valid[0]:
            return render_template('login.html', error=email_valid[1])
                
        email = email_valid[1]

        for user in users_list:
            if email == user["email"] and check_password(password, user["password"]):
                session['user'] = user["id"]

                return jsonify({
                    "id": user["id"],
                    "name": user["name"],
                    "email": user["email"],
                    "address": user["address"],
                    "phone": user["phone"]
                })

        return render_template('login.html', error='Invalid email or password')
    else:
        if session.get('user'):
            return redirect('/home')

        return render_template('login.html')
    
    
@app.route('/pass_page', methods=['GET', 'POST'])
def pass_page():
    if request.method == 'POST':
        return redirect('/pass')
    return render_template('forget.html')

@app.route('/pass', methods=['POST'])
def forgot_password():
    email = request.form['email']
    security_answer = request.form['security_question']

    try:
        with open('usersDB.json', 'r') as file:
            users = json.load(file)

        for user in users:
            if user['email'] == email and user.get('security_question') == security_answer:
                session['reset_email'] = email
                return redirect('/reset_password')

        flash('Invalid email or security answer. Please try again.', 'error')
        return redirect('/pass_page')

    except json.JSONDecodeError:
        flash('Error reading user database. Please contact support.', 'error')
    except IOError:
        flash('Error accessing user database. Please try again later.', 'error')
    except Exception as e:
        flash(f'An unexpected error occurred: {str(e)}', 'error')

    return redirect('/pass_page')

@app.route('/reset_password', methods=['GET', 'POST'])
def reset_password():
    if request.method == 'POST':
        new_password = request.form['new_password']
        confirm_password = request.form['confirm_password']

        if new_password != confirm_password:
            flash('Passwords do not match. Please try again.', 'error')
            return redirect('/reset_password')

        try:
            email = session.get('reset_email')

            if not email:
                flash('Session expired. Please try again.', 'error')
                return redirect('/pass_page')

            with open('usersDB.json', 'r') as file:
                users = json.load(file)

            for user in users:
                if user['email'] == email:
                    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
                    user['password'] = hashed_password.decode('utf-8')
                    break

            with open('usersDB.json', 'w') as file:
                json.dump(users, file, indent=4)

            flash('Password has been reset successfully!', 'success')
            return redirect('/login')

        except json.JSONDecodeError:
            flash('Error reading user database. Please contact support.', 'error')
        except IOError:
            flash('Error accessing user database. Please try again later.', 'error')
        except Exception as e:
            flash(f'An unexpected error occurred: {str(e)}', 'error')

        return redirect('/reset_password')

    return render_template('reset_password.html')



@app.route('/logout')
def logout():
    session.clear()
    return redirect('/login')

if __name__ == '__main__':
    app.run(debug=True)