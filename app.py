from flask import Flask, render_template, request, redirect, flash
import pymysql

app = Flask(__name__)
app.secret_key = "dnkvjhrbhvjbdlkjvdvnhgflkjbdvkdjvlknjvdsnkvrugryteincdkjsroihgiurvnrvorhgrevjbhbrvkervnmvamsdvkrbvj"

# Database connection (PyMySQL)
def get_db_connection():
    return pymysql.connect(
        host='localhost',
        user='root',
        password='Sanket8787',
        db='portfolio',
        cursorclass=pymysql.cursors.DictCursor
    )

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        email = request.form['email']
        message = request.form['textarea']
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO contacts (email, message) VALUES (%s, %s)", (email, message))
        conn.commit()
        cur.close()
        conn.close()
        flash('Thank You! Your message has been sent.', 'success')
        return redirect('/')
    return render_template('index.html')

@app.route("/about")
def about():
    return render_template("about.html")

if __name__ == '__main__':
    app.run(debug=True)
