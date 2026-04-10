from flask import Flask, render_template, send_from_directory
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')


@app.route('/resume')
def download_resume():
    return send_from_directory(BASE_DIR, 'resume.pdf', as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)
