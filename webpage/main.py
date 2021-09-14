import os
import mysql.connector

from flask import Flask

app = Flask(__name__)


def unix_connect_db(db_user, db_pass, db_name, db_socket_dir, cloud_sql_connection_name):

    conn = mysql.connector.connect(user=db_user,
                                password=db_pass,
                                unix_socket="{}/{}".format(db_socket_dir, cloud_sql_connection_name),
                                database=db_name)

    return conn



@app.route("/")
def hello_world():
    name = os.environ.get("NAME", "World")
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_name = os.environ["DB_NAME"]
    db_socket_dir = "/cloudsql"
    cloud_sql_connection_name = os.environ["CLOUD_SQL_CONNECTION_NAME"]

    conn = unix_connect_db(db_user, db_pass, db_name, db_socket_dir, cloud_sql_connection_name)

    conn.execute( "SELECT * FROM players")

    myresult = conn.fetchall()

    for x in myresult:
        html_string += f"<p>{x}/n</p>"


    html_string += "</body></html>"

    conn.close()

    return html_string


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
