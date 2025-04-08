from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask (__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

@app.route("/")
def home():
    return render_template("index.htm")

@socketio.on("message")
def handle_message(data):
    name = data.get("name")
    text = data.get("text")
    full_message = f"{name}: {text}"
    print(f"Message received: {full_message}")
    send(full_message, broadcast=True)


if __name__ == "__main__":
    socketio.run(app, debug=True)

