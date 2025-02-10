from flask import request, session, jsonify, render_template, redirect
import json

def setup_profile_routes(app):
    @app.route('/profile')
    def profile():
        if not session.get('user'):
            return redirect('/login')

        user_id = str(session.get('user'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            current_user = next((user for user in users_list if str(user['id']) == user_id), None)

            if current_user:
                
                return render_template('profile.html', user=current_user)
            else:
                return render_template('profile.html', error='User not found')

        except (FileNotFoundError, json.JSONDecodeError) as e:
            
            return render_template('profile.html', error='User data not found')

    @app.route('/update_profile', methods=['POST'])
    def update_profile():
        if not session.get('user'):
            return jsonify({"error": "You need to be logged in"}), 403

        user_id = str(session.get('user'))
        new_data = request.json

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if str(user['id']) == user_id:
                    # 🛑 لا تسمح بتغيير ID أو Email مباشرة
                    user.update({k: v for k, v in new_data.items() if k not in ['id', 'email']})
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Profile updated successfully"})

        except Exception as e:
            return jsonify({"success": False, "message": str(e)})

    @app.route('/update_profile_page')
    def update_profile_page():
        if not session.get('user'):
            return redirect('/login')
        return render_template('update_profile.html')

    @app.route('/profile_data')
    def profile_data():
        if not session.get('user'):
            return jsonify({"success": False, "message": "Not logged in"}), 403

        user_id = str(session.get('user'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            current_user = next((user for user in users_list if str(user['id']) == user_id), None)

            if current_user:
                return jsonify({"success": True, "user": current_user})
            else:
                return jsonify({"success": False, "message": "User not found"})

        except Exception as e:
            return jsonify({"success": False, "message": str(e)})
