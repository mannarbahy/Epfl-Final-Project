from flask import render_template, request, redirect, flash, session, jsonify
from models.user import User
import json
import bcrypt

def setup_password_routes(app):

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
