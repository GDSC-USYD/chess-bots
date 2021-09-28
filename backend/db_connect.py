# Functions to support connecting to database.
import sqlalchemy
import pymysql.cursors
import os



def tcp_connect_to_db(db_user, db_pass, db_host, db_name):
    """
    Connects to database over tcp socket
    Returns -> conn
    """
    db_host_args = db_host.split(":")
    db_hostname, db_port = db_host_args[0], int(db_host_args[1])

    pool = sqlalchemy.create_engine(
        # Equivalent URL:
        # mssql+pytds://<db_user>:<db_pass>@/<host>:<port>/<db_name>?driver=ODBC+Driver+17+for+SQL+Server
        sqlalchemy.engine.url.URL.create(
            "mysql+pymysql",
            username=db_user,
            password=db_pass,
            database=db_name,
            host=db_hostname,
            port=db_port
            )
        )

    return pool



def unix_connect_to_db(db_user, db_pass, db_name, db_socket_dir, cloud_sql_connection_name):
    """
    Connects to database over unix socket
    Returns -> conn
    """
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
                    db_socket_dir,  # i.e "/cloudsql"
                    cloud_sql_connection_name)  # i.e "<PROJECT-NAME>:<INSTANCE-REGION>:<INSTANCE-NAME>"
                }
            )
        )

    return pool



def connect_to_db():
    """
    Returns connection pool to database
    Returns -> conn
    """
    db_user, db_pass, db_host, db_name, db_socket_dir, cloud_sql_connection_name, db_conn_method = get_db_credentials()

    if db_conn_method == "unix":
        return unix_connect_to_db(db_user, db_pass, db_name, db_socket_dir, cloud_sql_connection_name)
    else: # assume tcp
        return tcp_connect_to_db(db_user, db_pass, db_host, db_name)



def get_db_credentials():
    """
    Retrieves credentials from environment variables
    Returns -> db_user, db_pass, db_host, db_name, db_socket_dir, cloud_sql_connection_name, db_conn_method
    """
    db_user = os.environ["DB_USER"]
    db_pass = os.environ["DB_PASS"]
    db_host = os.environ["DB_HOST"]
    db_name = os.environ["DB_NAME"]
    db_socket_dir = "/cloudsql"
    cloud_sql_connection_name = os.environ["CLOUD_SQL_CONNECTION_NAME"]
    db_conn_method = os.environ.get("DB_CONN_METHOD", "unix")

    return db_user, db_pass, db_host, db_name, db_socket_dir, cloud_sql_connection_name, db_conn_method
