from db_connect import *

from flask import Flask
# import os # imported in db_connect


app = Flask(__name__)


# returns a html string to display on page
@app.route("/")
def print_db():

    # connect to db
    db = connect_to_db()

    # create returned html string
    html_string = "<!DOCTYPE html><html><body>"

    # populate html body with database contents
    with db.connect() as conn:

        html_string += "<h1>Players\n</h1>"

        db_players = conn.execute(
            "SELECT * FROM players "
        ).fetchall()

        for x in db_players:
            html_string += f"<p>{x}\n</p>"

        html_string += "<h1>Matches\n</h1>"

        db_matches = conn.execute(
            "SELECT * FROM matches "
        ).fetchall()

        for x in db_matches:
            html_string += f"<p>{x}\n</p>"

        conn.close()

    # close off returned html string
    html_string += "</body></html>"

    return html_string


def main():
    #run app
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


if __name__ == "__main__":
    main()
