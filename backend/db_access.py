# Functions to support querying and updating (accessing) the database.

import sqlalchemy
import pymysql.cursors
import re



def db_update_player_data(conn, player):
    """
    Updates player data in db according to given -> db connection & player object
    Called by Chess Game Master after a batch of chess games

    Updates:
    # player.elo_score
    # player.status_flag

    Returns -> db_upload_message
    """
    db_upload_message = "OK"

    try:
        conn.execute(f"UPDATE players SET elo_score = '{player.elo_score}', status_flag = '{player.status_flag}' WHERE player_id = {player.player_id};")

        return db_upload_message
    except Exception as e:
        #print(e)
        db_upload_message = str(e)
        return db_upload_message



def db_insert_new_match(conn, match):
    """
    Inserts new match data in db according to given -> db connection &  match object
    Called by Chess Game Master after a batch of chess games
    Has different routines depending on status flag of match

    Updates:
    # match.player_1_id
    # match.player_2_id
    # match.batch_id
    # match.date
    # match.time
    # match.status_flag
    # match.winner_id (IF match.status_flag = 1)
    # match.pgn (IF match.status_flag > 0)
    # match.player_1_score (IF match.status_flag > 0)
    # match.player_2_score (IF match.status_flag > 0)
    # match.player_2_score (IF match.status_flag > 0)

    Returns -> db_upload_message
    """
    db_upload_message = "OK"

    try:
        if match.status_flag < 0: # no game played
            conn.execute(f"INSERT INTO matches (player_1_id, player_2_id, batch_id, date, time, status_flag) VALUES ({match.player_1_id}, {match.player_2_id}, {match.batch_id}, '{match.date}', '{match.time}', {match.status_flag});")
        elif match.status_flag == 2: # tied and no winner found
            conn.execute(f"INSERT INTO matches (player_1_id, player_1_score, player_2_id, player_2_score, pgn, batch_id, date, time, status_flag) VALUES ({match.player_1_id}, {match.player_1_score}, {match.player_2_id}, {match.player_2_score}, '{match.pgn}', {match.batch_id}, '{match.date}', '{match.time}', {match.status_flag});")
        else:
            conn.execute(f"INSERT INTO matches (player_1_id, player_1_score, player_2_id, player_2_score, pgn, batch_id, date, time, winner_id, status_flag) VALUES ({match.player_1_id}, {match.player_1_score}, {match.player_2_id}, {match.player_2_score}, '{match.pgn}', {match.batch_id}, '{match.date}', '{match.time}', {match.winner_id}, {match.status_flag});")
        #conn.execute(f"UPDATE matches SET player_1_id = {match.player_1_id}, player_1_score = {match.player_1_score}, player_2_id = {match.player_2_id}, player_2_score = {match.player_2_score}, pgn = '{match.pgn}', batch_id = '{match.batch_id}', date = '{match.date}', time = '{match.time}', winner_id = {match.winner_id}, status_flag = {match.status_flag} ;")

        return db_upload_message
    except Exception as e:
        #print(e)
        db_upload_message = str(e)
        return db_upload_message



def db_latest_batch_id(conn):
    """
    Retrieves latest batch_id from db or None if no batches found
    Returns -> batch_id | None
    """
    db_query = conn.execute(
        f"SELECT MAX(batch_id) FROM matches;"
    ).fetchall()

    batch_id = db_query[0][0] # None if no batches found

    return batch_id



def db_insert_new_player(conn, table_name, name, password, email):
    """
    Inserts given player details into database and returns new player_id
    Returns -> db_upload_message, player_id

    NOTE:
    status_flag = 0 # just initialised code
    elo_score = 0 # just initialised score
    """
    db_upload_message = "OK"

    # insert new player into db
    try:
        conn.execute(f"INSERT INTO {table_name} (name, elo_score, status_flag, password, email) VALUES ('{name}', 0, 0, '{password}', '{email}');")

        # check now in database and retrieve player_id
        db_upload_message, player_id = db_confirm_player_credentials(conn, table_name, name, password)

        return db_upload_message, player_id

    except Exception as e:
        player_id = None
        #print(e)
        db_upload_message = str(e)
        return db_upload_message, player_id



def db_confirm_player_credentials(conn, table_name, name, password):
    """
    Checks given player credentials are in database and returns player_id
    Returns -> db_upload_message, player_id | db_upload_message, None
    """
    db_check_message = "OK"

    db_player_id = conn.execute(
        f"SELECT player_id FROM {table_name} WHERE name = '{name}' AND password = '{password}'"
    ).fetchone()

    if db_player_id != None: #None if not found
        player_id = db_player_id[0]
        return db_check_message, player_id
    else: # not found
        db_check_message = "Player not found."
        player_id = None
        return db_check_message, player_id



def db_retrieve_entry_data(conn, table_name, id_name, id_value):
    """
    Calls db and returns table entry from given -> table where given -> var_name = var_value
    Returns tuple -> (id, ...entry data...) | None (if not found)
    """
    db_entry = conn.execute(
        f"SELECT * FROM {table_name} WHERE {id_name}='{id_value}';"
    ).fetchall()

    if len(db_entry) > 0:
        return db_entry[0]
    else:
        return None



def db_retrieve_table_list(conn, table_name):
    """
    Calls db and returns table data stored as list of dictionaries from given -> table_name
    Returns -> [{...entry data key value pairs...},...]
    """
    table_list = []

    db_table = db_retrieve_table_data(conn, table_name)

    for entry in db_table:
        if table_name == "players":
            player_dict = {}
            player_dict["player_id"] = entry[0]
            player_dict["name"] = entry[1]
            player_dict["elo_score"] = entry[2]
            player_dict["model_url"] = entry[3]
            player_dict["status_flag"] = entry[4]
            player_dict["email"] = entry[5]
            player_dict["password"] = entry[6]

            table_list.append(player_dict)

        elif table_name == "matches":
            match_dict = {}
            match_dict["match_id"] = entry[0]
            match_dict["player_1_id"] = entry[1]
            match_dict["player_1_score"] = entry[2]
            match_dict["player_2_id"] = entry[3]
            match_dict["player_2_score"] = entry[4]
            match_dict["pgn"] = entry[5]
            match_dict["batch_id"] = entry[6]
            match_dict["date"] = entry[7]
            match_dict["time"] = entry[8]
            match_dict["winner_id"] = entry[9]
            match_dict["status_flag"] = entry[10]

            table_list.append(match_dict)

    return table_list



def db_retrieve_table_dict(conn, table_name):
    """
    Calls db and returns table data converted to formatted dictionary from given -> table_name
    Returns dict -> {id:[... entry data...], ...}
    """
    table_dict = {}

    db_table = db_retrieve_table_data(conn, table_name)

    for entry in db_table:
        id = entry[0]
        data = entry[1:]
        # add player data into formatted dictionary
        table_dict[id] = list(data)

    return table_dict



def db_retrieve_table_data(conn, table_name):
    """
    Calls db and returns table data stored as tuples from given -> table_name
    Returns tuples -> ((id, ...entry data...),...)
    """
    db_table = conn.execute(
        f"SELECT * FROM {table_name};"
    ).fetchall()

    return db_table



def db_describe_table(conn, table_name):
    """
    Calls db and returns table description stored as tuples of given -> table_name
    Returns tuples -> ((coloumn_var, ...coloum settings...),...)
    """
    db_table_description = conn.execute(
        f"DESCRIBE {table_name};"
    ).fetchall()

    if len(db_table_description) > 0:
        return db_table_description
    else:
        return None



def db_update_coloumn(conn, table_name, id_name, id_value, var_name, var_value):
    """
    Uploads given coloumn (model_url) into database of given player_id
    Returns -> db_upload_message

    NOTE:
    RESETS status_flag to -> 1 (model_url given code)
    """
    db_upload_message = "OK"

    db_entry = conn.execute(
        f"SELECT * FROM {table_name} WHERE {id_name}={id_value};"
    ).fetchall()

    if len(db_entry) > 0:
        try:
            #conn.begin()
            conn.execute(f"UPDATE {table_name} SET {var_name} = '{var_value}', status_flag = 1 WHERE {id_name} = {id_value};")
            #conn.commit()
            return db_upload_message
        except Exception as e:
            #print(e)
            db_upload_message = e
            return db_upload_message
    else: # not found
        db_upload_message = "Player not found."
        return db_upload_message



def check_valid_email(email):
    """
    Checks if given email is valid format before entering into db
    Returns -> True | False
    """
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.fullmatch(regex, email):
        return True
    else:
        return False
