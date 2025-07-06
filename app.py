from flask import Flask, render_template, request, redirect,flash
from flask_mysqldb import MySQL

app = Flask(__name__)
app.secret_key="dnkvjhrbhvjbdlkjvdvnhgflkjbdvkdjvlknjvdsnkvrugryteincdkjsroihgiurvnrvorhgrevjbhbrvkervnmvamsdvkrbvj"

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Sanket8787'
app.config['MYSQL_DB'] = 'portfolio'

mysql = MySQL(app)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        email = request.form['email']
        message = request.form['textarea']
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO contacts (email, message) VALUES (%s, %s)", (email, message))
        mysql.connection.commit()
        cur.close()
        flash('Thank You! Your message has been sent.','success')
        return redirect('/thank-you')
    return render_template('index.html')
@app.route("/about")
def about():
    return render_template("about.html")
@app.route("/thank-you")
def thank_you():
    return render_template("thank-you.html")
if __name__ == '__main__':
    app.run(debug=True)
