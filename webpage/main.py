from db_connect import *
from game_master import *
from db_access import *



from flask import Flask, jsonify, make_response, redirect, url_for, request
# import os # imported in db_connect



app = Flask(__name__)


#NOT FINISHED
@app.route('/forgotpass', methods=["POST"]) # POST
def player_reset_password():
    # sends email to given email address to regain password
    # recieves form dict ->
    # {"name":name, "email", email}


    data_dict = request.form.to_dict()

    print(data_dict)

    try:
        name = data_dict["name"]
        email = data_dict["email"]
        table_name = "players"
        credentials_message = "OK"

        if len(password) < 8:
            raise Exception(password, "Password is too short.")
        elif len(name) < 1:
            raise Exception(name, "Name is too short.")

    except Exception as e:
        if len(e.args) > 0:
            credentials_message = f"Error with value: {e.args[0]}. {e.args[1]}"
        else:
            credentials_message = e
        data = {'message': 'Error', 'code': 'FAIL', "payload": str(credentials_message)}
        status_code = 400
        return make_response(jsonify(data), status_code)

    # passed initial check


    # do something


    db_check_message = "Not Implemented Yet"

    # if found + OK
    if db_check_message == "OK":
        data = {'message': 'Approved', 'code': 'SUCCESS', "payload": db_check_message}
        status_code = 201
    else: #if error
        data = {'message': 'Denied', 'code': 'FAIL', "payload": str(db_check_message)}
        status_code = 400

    return make_response(jsonify(data), status_code)


#NOT FINISHED
@app.route('/login', methods=["POST"]) # POST
def player_login():
    # accepts or refuses player login request into db
    # recieves form dict ->
    # {"name":name, "password":password}

    data_dict = request.form.to_dict()

    print(data_dict)

    try:
        name = data_dict["name"]
        password = data_dict["password"]
        table_name = "players"
        credentials_message = "OK"

        if len(password) < 8:
            raise Exception(password, "Password is too short.")
        elif len(name) < 1:
            raise Exception(name, "Name is too short.")

    except Exception as e:
        if len(e.args) > 0:
            credentials_message = f"Error with value: {e.args[0]}. {e.args[1]}"
        else:
            credentials_message = e
        data = {'message': 'Error', 'code': 'FAIL', "payload": str(credentials_message)}
        status_code = 400
        return make_response(jsonify(data), status_code)

    # passed initial check
    db = connect_to_db()
    with db.connect() as conn:
        db_check_message = db_confirm_player_credentials(conn, table_name, name, password)
        conn.close()

    # if found + OK
    if db_check_message == "OK":
        data = {'message': 'Approved', 'code': 'SUCCESS', "payload": db_check_message}
        status_code = 201
    else: #if error
        data = {'message': 'Denied', 'code': 'FAIL', "payload": str(db_check_message)}
        status_code = 400

    return make_response(jsonify(data), status_code)


#NOT FINISHED
@app.route('/register', methods=["POST"]) # POST
def new_player():
    # inserts new player into db
    # recieves form dict ->
    # {"name":name, "password":password, "email", email}

    data_dict = request.form.to_dict()

    print(data_dict)

    try:
        table_name = "players"
        name = data_dict["name"]
        password = data_dict["password"]
        email = data_dict["email"]
        credentials_message = "OK"

        if len(password) < 8:
            raise Exception(password, "Password is too short.")
        elif len(name) < 1:
            raise Exception(name, "Name is too short.")

    except Exception as e:
        if len(e.args) > 0:
            credentials_message = f"Error with value: {e.args[0]}. {e.args[1]}"
        else:
            credentials_message = e
        data = {'message': 'Error', 'code': 'FAIL', "payload": str(db_upload_message)}
        status_code = 400
        return make_response(jsonify(data), status_code)

    # passed initial check
    db = connect_to_db()
    with db.connect() as conn:
        db_upload_message = db_insert_new_player(conn, table_name, name, password, email)
        conn.close()

    # if created + OK
    if db_upload_message == "OK":
        data = {'message': 'Created', 'code': 'SUCCESS', "payload": db_upload_message}
        status_code = 201
    else: #if error
        data = {'message': 'Error', 'code': 'FAIL', "payload": str(db_upload_message)}
        status_code = 400

    return make_response(jsonify(data), status_code)



@app.route('/<player_id>/model_url', methods=["GET"]) # GET e.g /2/model_url
def return_model_url(player_id):
    # retrieves match pgn given match_id
    db = connect_to_db()

    with db.connect() as conn:
        db_player = db_retrieve_entry_data(conn, "players", "player_id", int(player_id))
        conn.close()

    if db_player == None:
        # player doesn't exist / error retrieving from DB
        model_url = None
    else:
        # retrieve player model_url
        model_url = db_player[3]

    # if found
    if model_url != None:
        data = {'message': 'Found', 'code': 'SUCCESS', "payload": model_url}
        status_code = 201
    else:
        data = {'message': 'Unfound', 'code': 'FAIL', "payload": model_url}
        status_code = 404

    return make_response(jsonify(data), status_code)



@app.route('/<match_id>/pgn', methods=["GET"]) # GET e.g /2/pgn
def return_pgn(match_id):
    # retrieves and returns match pgn given match_id
    # return -> png
    db = connect_to_db()

    with db.connect() as conn:
        db_match = db_retrieve_entry_data(conn, "matches", "match_id", int(match_id))
        conn.close()

    if db_match == None:
        # Match doesn't exist / error retrieving from DB
        pgn = None
    else:
        pgn = db_match[3]

    # if found
    if pgn != None:
        data = {'message': 'Found', 'code': 'SUCCESS', "payload": pgn}
        status_code = 201
    else:
        data = {'message': 'Unfound', 'code': 'FAIL', "payload": None}
        status_code = 404

    return make_response(jsonify(data), status_code)



@app.route("/matches", methods=["GET"]) # GET
def return_matches():
    # returns the dict of matches with
    # return [key:value,...] -> {match_id:[...,match data,...],...}
    db = connect_to_db()

    with db.connect() as conn:
        db_matches = db_retrieve_table_dict(conn, "matches")
        conn.close()

    # if found
    if db_matches != None:
        data = {'message': 'Found', 'code': 'SUCCESS', "payload": db_matches}
        status_code = 201
    else: #if not found
        data = {'message': 'Unfound', 'code': 'FAIL', "payload": None}
        status_code = 404

    return make_response(jsonify(data), status_code)



@app.route("/players", methods=["GET"]) # GET
def return_players():
    # returns the dict of players with
    # return [key:value,...] -> {player_id:[...,match data,...],...}
    db = connect_to_db()

    with db.connect() as conn:
        db_players = db_retrieve_table_dict(conn, "players")
        conn.close()

    # if found
    if db_players != None:
        data = {'message': 'Found', 'code': 'SUCCESS', "payload": db_players}
        status_code = 201
    else: #if not found
        data = {'message': 'Unfound', 'code': 'FAIL', "payload": None}
        status_code = 404

    return make_response(jsonify(data), status_code)



@app.route("/elo", methods=["GET"]) # GET
def return_elo():
    # returns a shortened dict of players with
    # return [key:value,...] -> {player_id:[name,elo_score],...}
    db = connect_to_db()

    with db.connect() as conn:
        db_players = db_retrieve_table_dict(conn, "players")
        conn.close()

    for player_id in db_players:
        db_players[player_id] = db_players[player_id][0:2] # just keep name and elo_score

    # if found
    if db_players != None:
        data = {'message': 'Found', 'code': 'SUCCESS', "payload": db_players}
        status_code = 201
    else: #if not found
        data = {'message': 'Unfound', 'code': 'FAIL', "payload": None}
        status_code = 404

    return make_response(jsonify(data), status_code)



# on scheduler call launch games master to run chess bot games
@app.route("/rungames", methods=["POST"]) # POST
def launch_chess_game_master():
    # create chess game master and run games in another thread

    #db = connect_to_db()
    #with db.connect() as conn:
    #    chess_game_master = ChessGameMaster()
    #    threading.Thread(target=chess_game_master.run, args=(conn,)).start()

    #chess_game_master.run()

    # assume AOK
    data = {'message': 'Launched', 'code': 'SUCCESS'}
    return make_response(jsonify(data), 201)

    # keeping second option in case above fails
    #resp = jsonify(success=True)
    #return resp

    # third option
    #return jsonify({'error': 'Admin access is required'}), 401



@app.route("/update", methods=["POST"])
def update_entry():
    # updates given table entry's coloumn value in database to given value
    # recieves form dict ->
    # {"table_name":table_name, "id_value":id_value, "var_name":var_name, "var_value":var_value}

    data_dict = request.form.to_dict()

    print(data_dict)

    table_name = data_dict["table_name"]
    id_value = data_dict["id_value"]
    var_name = data_dict["var_name"]
    var_value = data_dict["var_value"]

    db = connect_to_db()
    with db.connect() as conn:

        if table_name == "players":
            id_name = "player_id"
        elif table_name == "matches":
            id_name = "match_id"

        db_upload_message = db_update_coloumn(conn, table_name, id_name, id_value, var_name, var_value)

    conn.close()

    # if found
    if db_upload_message == "OK":
        data = {'message': 'Updated', 'code': 'SUCCESS', "payload": db_upload_message}
        status_code = 201
    else: #if not found
        data = {'message': 'Error', 'code': 'FAIL', "payload": str(db_upload_message)}
        status_code = 404

    return make_response(jsonify(data), status_code)



# returns a html string of db contents to display on page + db table descriptions
@app.route("/database", methods=["GET"]) # GET
def print_db():

    # connect to db
    db = connect_to_db()

    # create returned html string
    html_string = "<!DOCTYPE html><html><body>"

    # populate html body with database table contents & desciptions
    with db.connect() as conn:

        # show entries of database tables
        db_players = db_retrieve_table_data(conn, "players")

        html_string += "<h1>Players\n</h1>"

        for x in db_players:
            html_string += f"<p>{x}\n</p>"

        html_string += "<h1>Matches\n</h1>"

        db_matches = db_retrieve_table_data(conn, "matches")

        for x in db_matches:
            html_string += f"<p>{x}\n</p>"

        # describe database tables
        html_string += "<h1>Players Description\n</h1>"

        db_describe_players = db_describe_table(conn, "players")
        for x in db_describe_players:
            html_string += f"<p>{x}\n</p>"

        html_string += "<h1>Matches Description\n</h1>"

        db_describe_matches = db_describe_table(conn, "matches")
        for x in db_describe_matches:
            html_string += f"<p>{x}\n</p>"

        conn.close()

    # close off returned html string
    html_string += "</body></html>"

    return html_string



@app.route("/")
def home():
    return redirect("database")


def main():
    #run app
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 8080)))


if __name__ == "__main__":
    main()
