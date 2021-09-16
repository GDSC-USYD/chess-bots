from db_connect import *

from flask import Flask
import os


app = Flask(__name__)



# returns a html string to display on page
@app.route("/")
def hello_world():
    #name = os.environ.get("NAME", "World")

    db_user, db_pass, db_host, db_name, db_socket_dir, cloud_sql_connection_name = get_db_credentials()

    db = connect_to_db(db_user, db_pass, db_host, db_name, db_socket_dir, cloud_sql_connection_name)

    html_string = "<!DOCTYPE html><html><body>"

    #conn = unix_connect_db(db_user, db_pass, db_name, db_socket_dir, cloud_sql_connection_name)
    with db.connect() as conn:
        #print("Here")
        db_players = conn.execute(
            "SELECT * FROM players "
        ).fetchall()
        # Convert the results into a list of dicts representing votes

        #for p in db_players:
        #    print(p)

        for x in db_players:
            html_string += f"<p>{x}\n</p>"

        conn.close()

    html_string += "</body></html>"


    return html_string


def main():
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


if __name__ == "__main__":
    main()
