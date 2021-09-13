import os

from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    name = os.environ.get("NAME", "World")

    works = False
    db_user = None
    db_pass = None
    db_name = None
    db_host = None
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_name = os.environ["DB_NAME"]
    db_host = os.environ["DB_NAME"]
    if None not in [db_user,db_pass,db_name,db_host]:
        works = True
    return f"Hello {name}! Works: {works}"


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
