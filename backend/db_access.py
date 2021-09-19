# Functions to support querying and updating (accessing) the database.

import sqlalchemy
import pymysql.cursors
import re




def db_update_player_data(conn, player):
    #updates player data in db according to given player object

    # self.player_id = player_id
    # self.name = name
    # self.elo_score = elo_score
    # self.model_url = model_url
    # self.status_flag = status_flag # reset to zero every new VM instance?
    # self.model_path = None
    # self.scores = []

    try:
        #conn.begin()
        conn.execute(f"UPDATE players SET elo_score = '{player.elo_score}', status_flag = '{player.status_flag}' WHERE player_id = {player.player_id};")
        #conn.commit()
        return db_upload_message
    except Exception as e:
        print(e)
        db_upload_message = e
        return db_upload_message

    # update_data = (("elo_score", player.elo_score), ("status_flag", player.status_flag))
    # for var_name, var_value in update_data:
    #     db_update_coloumn(conn, "players", "player_id", player.player_id, var_name, var_value)




#NOT FINISHED
def db_insert_matches_data(conn, batch_id, matches_data):
    #inserts new matches data in db according to given matches object list

    #for match in matches_data:


    pass



def db_latest_batch_id(conn):
    # retrieves and returns latest batch_id from db or None if no batches found

    db_query = conn.execute(
        f"SELECT MAX(batch_id) FROM matches;"
    ).fetchall()

    batch_id = db_query[0][0] # None if no batches found
    #
    # if batch_id = db_query[0][0] !=  0:
    #     print(db_query)
    #
    #     print(batch_id)
    #     return batch_id
    # else:
    return batch_id



def db_insert_new_player(conn, table_name, name, password, email):
    # inserts given  into database of given player_id's
    # returns db_upload_message string -> status of db update
    status_flag = 0 # just initialised status code
    db_upload_message = "OK"

    # insert new player into db
    try:
        #conn.begin()
        conn.execute(f"INSERT INTO {table_name} (name, status_flag, password, email) VALUES ('{name}', {status_flag}, '{password}', '{email}');")
        #conn.commit()

        # check now in database and retrieve player_id
        db_upload_message, player_id = db_confirm_player_credentials(conn, table_name, name, password)

        return db_upload_message, player_id

    except Exception as e:
        player_id = None
        print(e)
        db_upload_message = e
        return db_upload_message, player_id



def db_confirm_player_credentials(conn, table_name, name, password):
    # checks given into database of given player_id's
    # returns db_upload_message string -> status of db update
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
    # calls db and returns table entry from given table with var_name = var_value
    # returns tuple -> (id, ...entry data...) or None if not found

    db_entry = conn.execute(
        f"SELECT * FROM {table_name} WHERE {id_name}='{id_value}';"
    ).fetchall()

    if len(db_entry) > 0:
        return db_entry[0]
    else:
        return None



def db_retrieve_table_list(conn, table_name):
    # calls db and returns table data converted to list of dictionaries
    # returns list -> [{... entry data...}, ...]

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
    # calls db and returns table data converted to formatted dictionary
    # returns dict -> {id:[... entry data...], ...}

    table_dict = {}
    db_table = db_retrieve_table_data(conn, table_name)

    for entry in db_table:
        id = entry[0]
        data = entry[1:]
        # add player data into formatted dictionary
        table_dict[id] = list(data)

    return table_dict



def db_retrieve_table_data(conn, table_name):
    # calls db and returns table data from given table by table_name
    # returns tuples -> ((id, ...entry data...),...)

    db_table = conn.execute(
        f"SELECT * FROM {table_name};"
    ).fetchall()

    return db_table



def db_describe_table(conn, table_name):
    # calls db and returns table description of given table by table_name
    # returns tuples -> ((coloumn_var, ...coloum settings...),...)

    db_table_description = conn.execute(
        f"DESCRIBE {table_name};"
    ).fetchall()

    if len(db_table_description) > 0:
        return db_table_description
    else:
        return None



def db_update_coloumn(conn, table_name, id_name, id_value, var_name, var_value):
    # uploads given model_url's into database of given player_id's
    # returns db_upload_message string -> status of db update
    db_upload_message = "OK"

    db_entry = conn.execute(
        f"SELECT * FROM {table_name} WHERE {id_name}={id_value};"
    ).fetchall()

    if len(db_entry) > 0:
        try:
            #conn.begin()
            conn.execute(f"UPDATE {table_name} SET {var_name} = '{var_value}' WHERE {id_name} = {id_value};")
            #conn.commit()
            return db_upload_message
        except Exception as e:
            print(e)
            db_upload_message = e
            return db_upload_message
    else: # not found
        db_upload_message = "Player not found."
        return db_upload_message



def check_valid_email(email):
    # checks if given email is valid before entering into db
    # return -> Boolean
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    if re.fullmatch(regex, email):
        return True
    else:
        return False
