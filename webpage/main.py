import os
import mysql.connector
import sqlalchemy


from flask import Flask

app = Flask(__name__)

def init_connection_engine():
    db_config = {
        "pool_size": 5,
        "max_overflow": 2,
        "pool_timeout": 30,  # 30 seconds
        "pool_recycle": 1800,  # 30 minutes
    }
    return init_unix_connection_engine(db_config)


def init_unix_connection_engine(db_config):

    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_name = os.environ["DB_NAME"]
    db_socket_dir = os.environ.get("DB_SOCKET_DIR", "/cloudsql")
    cloud_sql_connection_name = os.environ["CLOUD_SQL_CONNECTION_NAME"]

    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # mysql+pymysql://<db_user>:<db_pass>@/<db_name>?unix_socket=<socket_path>/<cloud_sql_instance_name>
        sqlalchemy.engine.url.URL.create(
            drivername="mysql+pymysql",
            username=db_user,  # e.g. "my-database-user"
            password=db_pass,  # e.g. "my-database-password"
            database=db_name,  # e.g. "my-database-name"
            query={
                "unix_socket": "{}/{}".format(
                    db_socket_dir,  # e.g. "/cloudsql"
                    cloud_sql_connection_name)  # i.e "<PROJECT-NAME>:<INSTANCE-REGION>:<INSTANCE-NAME>"
            }
        ),
        db_config
    )

    return pool

@app.route("/")
def hello_world():
    name = os.environ.get("NAME", "World")

    db = init_connection_engine()

    with db.connect() as conn:
        conn.execute( "SELECT * FROM players")

    myresult = conn.fetchall()

    html_string = f"<html><body><h1>Hello {name}! Works: {works}</h1>"

    for x in myresult:
      html_string += f"<p>{x}/n</p>"


    html_string += "</body></html>"

    cnx.close()

    return html_string


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))
