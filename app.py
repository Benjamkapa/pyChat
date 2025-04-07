from flask import Flask, render_template, request

app = Flask (__name__)

@app.route("/")
def home():
    return render_template("index.htm")


@app.route("/submit", methods=["POST"])
def submit():
    user_input = request.form["user_input"]
    return f"Just submitted: {user_input}"

if __name__ == "__main__":
    app.run(debug=True)