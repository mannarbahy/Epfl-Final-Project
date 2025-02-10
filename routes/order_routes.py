from flask import request, session, jsonify, render_template, redirect
from flask_mail import Mail, Message
from datetime import datetime
import json
import os

def setup_order_routes(app):
    mail = Mail(app)

    @app.route('/shop')
    def shop():
        category = request.args.get('category')
        user = session.get('user')
        return render_template('shop.html', category=category, user=user)

    @app.route('/get_products')
    def get_products():
        category = request.args.get('category')
        try:
            products = load_products()
            if category:
                products = [product for product in products if product.get('type') == category]
            return jsonify(products)
        except FileNotFoundError:
            return jsonify({"error": "Products file not found"}), 404
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON in products file"}), 500

    def load_products():
        with open('products.json', 'r') as f:
            return json.load(f)

    @app.route('/checkout')
    def checkout():
        user = session.get('user') 
        return render_template('checkout.html')

    @app.route('/get_product_details', methods=['POST'])
    def get_product_details():
        try:
            product_ids = request.json
            products = load_products()
            product_details = [p for p in products if str(p['id']) in product_ids]
            return jsonify(product_details)
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/save_order', methods=['POST'])
    def place_order():
        if not session.get('user'):
            return jsonify({"error": "You need to be logged in"}), 403

        user_id = str(session.get('user'))
        order_data = request.json
        order_data['order_date'] = datetime.now().isoformat()
        order_data['order_id'] = generate_order_id()

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            customer_email = None
            for user in users_list:
                if str(user['id']) == user_id:
                    if 'orders' not in user:
                        user['orders'] = []
                    user['orders'].append(order_data)
                    user['cart'] = {}
                    customer_email = user.get('email')
                    break

            with open("usersDB.json", "w") as file:
                json.dump(users_list, file, indent=4)

            if customer_email:
                send_confirmation_email(customer_email, order_data)

            return jsonify({"success": True, "message": "Order placed successfully"})
        except Exception as e:
            return jsonify({"success": False, "message": str(e)})

    def generate_order_id():
        return f"ORD-{datetime.now().strftime('%Y%m%d%H%M%S')}"

    def send_confirmation_email(email, order_data):
        order_items = "\n".join([f"{item['name']} x {item['quantity']} - ${item['price']}" for item in order_data['cart']])
        total_price = order_data['total']

        subject = "Order Confirmation"
        email_body = f"""
        🎉 Thank you for your order! 🎉
        
        Order ID: {order_data['order_id']}
        Order Date: {order_data['order_date']}
        
        Order Details:
        {order_items}

        🛒 Total: ${total_price}

        ✅ Your order has been successfully placed.
        """

        try:
            msg = Message(
                subject=subject,
                sender="BakeCraft <noreply@bakecraft.com>",
                recipients=[email],
                body=email_body
            )
            mail.send(msg)
           
        except Exception as e:
            pass

    @app.route('/get_orders', methods=['GET'])
    def get_orders():
        if not session.get('user'):
            return jsonify({"success": False, "error": "User not logged in"}), 403

        user_id = str(session.get('user'))

        try:
            with open('usersDB.json', 'r') as file:
                users_list = json.load(file)

            user = next((user for user in users_list if str(user['id']) == user_id), None)

            if user:
                return jsonify({"success": True, "orders": user.get('orders', [])})
            else:
                return jsonify({"success": False, "error": "User not found"}), 404

        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500
