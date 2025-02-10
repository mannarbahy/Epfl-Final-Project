from flask import Flask
from routes.home_routes import setup_home_routes 
from routes.auth_routes import setup_auth_routes
from routes.cart_routes import setup_cart_routes
from routes.wishlist_routes import setup_wishlist_routes
from routes.order_routes import setup_order_routes
from routes.profile_routes import setup_profile_routes
from routes.admin_routes import setup_admin_routes

app = Flask(__name__, template_folder="templates")
app.secret_key = 'your_secret_key'


setup_home_routes(app)
setup_auth_routes(app)
setup_cart_routes(app)
setup_wishlist_routes(app)
setup_order_routes(app)
setup_profile_routes(app)
setup_admin_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
