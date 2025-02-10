import bcrypt
import uuid
import json

class User:
    def __init__(self, name, email, password, address, phone, security_question, role):
        self.name = name
        self.email = email
        self.password = password
        self.address = address
        self.phone = phone
        self.security_question = security_question
        self.id = str(uuid.uuid4())  
        self.role = role
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
            "id": self.id,
            "password": hashed_password.decode('utf-8'),
            "address": self.address,
            "phone": self.phone,
            "security_question": self.security_question,
            "role": self.role,
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
