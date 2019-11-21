import os
import requests
from flask import Flask, render_template, request, session, json, abort, make_response
from flask_session import Session
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# Configure session to use filesystem
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)



def get_text(data):
    quote = f"server says: {data}"
    return quote

### Routes ###
@app.route("/", methods=["GET"])
def index():
    # store current text in session
    return render_template("index.html")

@socketio.on("textinput")
def generate_text(data):
    #print("Socket message received!")
    #text = data.get("text")
    text = get_text(data)
    print("sending data: ", text)
    emit("newdata", text, broadcast=False)

if __name__ == '__main__':
    app.debug = False
    app.run(host = '0.0.0.0',port=5000)
