import os
import mysql.connector

from flask import Flask

app = Flask(__name__)


@app.route("/")
def hello_world():
    name = os.environ.get("NAME", "World")

    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_host = os.environ["DB_HOST"]
    db_name = os.environ["DB_NAME"]

    # Extract host and port from db_host
    host_args = db_host.split(":")
    db_hostname, db_port = host_args[0], int(host_args[1])

    mydb = mysql.connector.connect(host=db_hostname, port=db_port, user=db_user, password=db_pass, database=db_name)

    mycursor = mydb.cursor()

    mycursor.execute("SELECT * FROM players")

    myresult = mycursor.fetchall()

    html_string = f"<html><body><h>Hello {name}! Works: {works}</h>"

    for x in myresult:
      html_string += f"<p>{x}/n</p>"


    html_string += "</body></html>"

    cnx.close()

    return html_string


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
