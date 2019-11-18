import os
import requests
from flask import Flask, render_template, request, session, json, abort, make_response
from flask_session import Session

app = Flask(__name__)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


### Routes ###
@app.route("/", methods=["GET", "POST"])
def index():
    text = request.form.get("text-input")
    if not text:
        text = "Hello World!"
    print(text)

    return render_template("index.html", output=text)
