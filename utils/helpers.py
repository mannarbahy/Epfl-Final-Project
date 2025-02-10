from email_validator import validate_email, EmailNotValidError
import bcrypt

def email_validation(email):
    try:
        email_info = validate_email(email, check_deliverability=False)
        return [True, email_info.normalized]
    except EmailNotValidError as e:
        return [False, str(e)]

def check_password(user_password, hashed_password):
    user_bytes = user_password.encode('utf-8') 
    saved_password = hashed_password.encode('utf-8')
    return bcrypt.checkpw(user_bytes, saved_password)
