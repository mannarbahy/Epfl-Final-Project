# BakeCraft - Final Project

BakeCraft is a web application designed to manage a bakery's operations, including user and admin functionalities. It allows users to browse bakery items, place orders, and manage their accounts, while admins can manage inventory, view orders, and perform administrative tasks. The application includes features like confirmation emails for user registration and password hashing using bcrypt for secure authentication. The data is stored and managed using a JSON file.

## Key Features
- **User and Admin Roles**: Separate functionalities for users and admins.
- **Confirmation Email**: Users receive a confirmation email upon registration.
- **Password Hashing**: Secure password storage using bcrypt.
- **JSON File Storage**: All data is stored and managed using a JSON file.

## Prerequisites
<hr/>
To run this project, you need to install the following Python modules:
- `Flask`: For the web framework.
- `bcrypt`: For password hashing.
- `json`: For reading and writing data to a JSON file.
- `smtplib`: For sending confirmation emails.
- jinja
- email-validator

You can install these modules using pip:
```bash
pip install Flask bcrypt
```

## Project Checklist
- ✔️ It is available on GitHub.
- ✔️ It uses the Flask web framework.
- ✔️ It uses at least one module from the Python Standard Library other than the random module.
  - **Module name**: `json`,`uuid`,`datetime`
- ✔️ It contains at least one class written by you that has both properties and methods.
  - **File name for the class definition**: `app.py`
  - **Line number(s) for the class definition**: 5-17
  - **Name of two properties**: `username`, `email`
  - **Name of two methods**: `hash_password()`, `format_data()`
  - **File name and line numbers where the methods are used**: `password_routes.py`, Name of two methods: hash_password(), format_data() , update_user_data(),lines 45-60
- ✔️ It makes use of JavaScript in the front end and uses the localStorage of the web browser.
- ✔️ It uses modern JavaScript (for example, `let` and `const` rather than `var`).
- ✔️ It makes use of the reading and writing to the same file feature.
- ✔️ It contains conditional statements.
  - **File name**: `cart_routes.py`
  - **Line number(s)**: 26-32
- ✔️ It contains loops.
  - **File name**: `cart_routes.py`
  - **Line number(s)**: 15-17
- ✔️ It lets the user enter a value in a text box at some point.
- ✔️ It doesn't generate any error message even if the user enters a wrong input.
- ✔️ It is styled using your own CSS.
- ✔️ The code follows the code and style conventions as introduced in the course, is fully documented using comments and doesn't contain unused or experimental code.
- ✔️ All exercises have been completed as per the requirements and pushed to the respective GitHub repository.

## How to Run the Project
1. Clone the repository from GitHub.
2. Install the required dependencies using pip:
   ```bash
   pip install Flask 
   pip install Flask bcrypt
   ```
3. Run the Flask application:
   ```bash
   python app.py
   ```
4. Open your web browser and navigate to `http://127.0.0.1:5000/` to access the application.

## Project Structure
- `app.py`: The main Flask application file.
- `models/user.py`: __init__ class for user 
- `data.json`: JSON file used for storing user and product data.
- `templates/`: Contains HTML templates for the front end.
- `static/`: Contains CSS and JavaScript files for styling and front-end functionality.
```bash
   my_flask_app/
├── app.py                 # Main Flask application file
├── models/
│   ├── user.py            # User model handling authentication & data storage
├── routes/                # Contains route handlers
│   ├── auth_routes.py     # Authentication-related routes
│   ├── cart_routes.py     # Cart management routes
│   ├── wishlist_routes.py # Wishlist management routes
│   ├── order_routes.py    # Order processing routes
│   ├── admin_routes.py    # Admin-related routes
│   ├── __init__.py        # Initializes the routes module
├── data/                  # Folder for storing JSON data
│   ├── usersDB.json       # Stores user data
│   ├── products.json      # Stores product data
├── templates/             # HTML templates for the frontend
├── static/                # Contains CSS and JavaScript files
│   ├── css         # Main stylesheet
│   ├── js          # Frontend JavaScript logic
│   └── images/            # Images used in the project
└── utils/
    └── helpers.py         # Utility functions for various tasks

   ```
## Conclusion
BakeCraft is a comprehensive web application that demonstrates the use of Flask, bcrypt, and JSON for managing a bakery's operations. It includes user and admin functionalities, secure authentication, and data management using a JSON file. The project adheres to all requirements and is fully documented for ease of understanding and further development.



