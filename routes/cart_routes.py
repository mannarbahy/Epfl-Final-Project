from flask import request, session, jsonify, render_template, redirect
import json

def setup_cart_routes(app):
    @app.route('/cart')
    def cart():
        user = session.get('user')
        return render_template('cart.html', user=user)

    @app.route('/add_to_cart', methods=['POST'])
    def add_to_cart():
        if not session.get('user'):
            return redirect('/login')

        user_id = str(session.get('user'))  # تأكد أنه نص
        product_id = str(request.json.get('product_id'))
        quantity = int(request.json.get('quantity', 1))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if str(user['id']) == user_id:
                    if 'cart' not in user:
                        user['cart'] = {}

                    if product_id in user['cart']:
                        user['cart'][product_id] += quantity
                    else:
                        user['cart'][product_id] = quantity
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Product added to cart!"})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/remove_from_cart', methods=['POST'])
    def remove_from_cart():
        if not session.get('user'):
            return jsonify({"error": "You need to be logged in"}), 403

        user_id = str(session.get('user'))
        product_id = str(request.json.get('product_id'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if str(user['id']) == user_id:
                    if 'cart' in user and product_id in user['cart']:
                        del user['cart'][product_id]
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Product removed from cart!"})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/remove_quantity_from_cart', methods=['POST'])
    def remove_quantity_from_cart():
        if not session.get('user'):
            return jsonify({"error": "You need to be logged in"}), 403

        user_id = str(session.get('user'))
        product_id = str(request.json.get('product_id'))
        quantity = int(request.json.get('quantity', 1))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            for user in users_list:
                if str(user['id']) == user_id:
                    if 'cart' in user and product_id in user['cart']:
                        user['cart'][product_id] -= quantity
                        if user['cart'][product_id] <= 0:
                            del user['cart'][product_id]
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            return jsonify({"success": True, "message": "Quantity updated!"})

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/get_cart_items', methods=['GET'])
    def get_cart_items():
        if not session.get('user'):
            return jsonify({"error": "User not logged in"}), 403

        user_id = str(session.get('user'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            user = next((u for u in users_list if str(u['id']) == user_id), None)

            cart_items = user['cart'] if user and 'cart' in user else {}
            cart_products = []

            with open('products.json', 'r') as file:
                products = json.load(file)

            for product_id, quantity in cart_items.items():
                for product in products:
                    if str(product['id']) == product_id:
                        product_copy = product.copy()  # حتى لا نعدل على الداتا الأصلية
                        product_copy['quantity'] = quantity
                        cart_products.append(product_copy)

            return jsonify(cart_products)

        except Exception as e:
            return jsonify({"error": str(e)}), 500
