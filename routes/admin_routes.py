from flask import render_template, session, redirect, request, jsonify
import json

def setup_admin_routes(app):
    def load_users():
        with open("usersDB.json", "r") as file:
            return json.load(file)

    @app.route('/admin_dashboard')
    def admin_dashboard():
        if 'user' in session and session.get('role') == "Admin":
            return render_template('admin_dashboard.html')
        return redirect('/login')

    @app.route('/admin_orders')
    def admin_orders():
        if 'user' in session and session.get('role') == "Admin":
            try:
                users_list = load_users()

                users_with_orders = [
                    {
                        'name': user['name'],
                        'email': user['email'],
                        'orders': user['orders']
                    }
                    for user in users_list if 'orders' in user and user['orders']
                ]

                return render_template('admin_orders.html', users=users_with_orders)
            except Exception as e:
                return render_template('admin_orders.html', error=str(e))
        return redirect('/login')

    @app.route('/admin_profile')
    def admin_profile():
        if 'user' in session and session.get('role') == "Admin":
            return render_template('adminprofile.html')
        return redirect('/login')

    
    @app.route('/admin_products', methods=['GET', 'POST'])
    def admin_products():
        if 'user' in session and session.get('role') == "Admin":
            return render_template('admin_users.html')
        return redirect('/login') 

    @app.route('/update_product', methods=['POST'])
    def update_product():
        if 'user' not in session or session.get('role') != "Admin":
            return jsonify({"success": False, "error": "Unauthorized"}), 403

        product_data = request.get_json()

        try:
            with open('products.json', 'r') as file:
                products = json.load(file)

            product_exists = False
            for product in products:
                if product['id'] == product_data['id']:
                    product.update(product_data)
                    product_exists = True
                    break

            if not product_exists:
                products.append(product_data)

            with open('products.json', 'w') as file:
                json.dump(products, file, indent=4)

            return jsonify({"success": True})

        except Exception as e:
            return jsonify({"success": False, "error": str(e)})
