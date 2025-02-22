from flask import render_template, session, redirect
import json

from models.user import User

def setup_home_routes(app):

    @app.route('/')
    @app.route('/home')
    def home():
        with open('usersDB.json') as file:
            users_list = json.load(file)
        
        if 'user' in session:
            role = session.get('role')  

            if role == "Admin":
                return redirect('/admin_dashboard') 
            
            if users_list:
                user = users_list[0]  
                return render_template('home.html', user=user)  
        
        else:
            return render_template('home.html', user=None)
    
    @app.route('/recipes')
    def recipes():
       user = session.get('user')
       return render_template('recipes.html', user=user)

    @app.route('/About_us')
    def aboutus():
       user = session.get('user')
       return render_template('aboutus.html', user=user)

    @app.route('/recipe_1')
    def recipe_1():
      user = session.get('user')
      return render_template('recipes2.html', user=user)

    @app.route('/recipe_2')
    def recipe_2():
      user = session.get('user')
      return render_template('recipes3.html', user=user)

    @app.route('/recipe_3')
    def recipe_3():
      user = session.get('user')
      return render_template('recipes4.html', user=user)  
