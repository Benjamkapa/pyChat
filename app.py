from flask import Flask, render_template
from flask_socketio import SocketIO, send

app = Flask(__name__)
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

@socketio.on("file")
def handle_file(data):
    name = data.get("name")
    file_data = data.get("fileData")  # The base64 string
    file_type = data.get("fileType")  # The MIME type of the file (e.g., image/jpeg)
    
    if file_data and file_type:
        print(f"Received file from {name} with type {file_type}")
        # Send the file as base64 along with the sender's name
        send({"name": name, "fileData": file_data, "fileType": file_type}, broadcast=True)

if __name__ == "__main__":
    socketio.run(app, debug=True)
