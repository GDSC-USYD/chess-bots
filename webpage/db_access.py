# Functions to support querying and updating (accessing) the database.

import sqlalchemy
import pymysql.cursors
import re



#NOT FINISHED
def db_latest_batch_id(conn):
    # retrieves and returns latest batch_id from db or None if no batches found
    temp = None
    batch_id = temp
    return batch_id



#NOT FINISHED
def db_update_player_data(conn, player):
    #updates player data in db according to given player object
    pass



#NOT FINISHED
def db_insert_matches_data(conn, batch_id, matches_data):
    #inserts new matches data in db according to given matches object list
    pass


#NOT FINISHED
def db_insert_new_player(conn, table_name, name, password, email):
    # inserts given  into database of given player_id's
    # returns db_upload_message string -> status of db update
    status_flag = 0 # just initialised flag

    if check_valid_email(email) == True:
        db_upload_message = "Not Implemented Yet"

        # insert new player into db

    else:
        db_upload_message = "Invalid Email."

    return db_upload_message


#NOT FINISHED
def db_confirm_player_credentials(conn, table_name, name, password):
    # checks given  into database of given player_id's
    # returns db_upload_message string -> status of db update
    db_check_message = "Not Implemented Yet"
    return db_check_message



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



def db_retrieve_entry_data(conn, table_name, id_name, id_value):
    # calls db and returns table entry from given table with var_name = var_value
    # returns tuple -> (id, ...entry data...)

    db_entry = conn.execute(
        f"SELECT * FROM {table_name} WHERE {id_name}={id_value}"
    ).fetchall()

    if len(db_entry) > 0:
        return db_entry[0]
    else:
        return None



def db_retrieve_table_data(conn, table_name):
    # calls db and returns table data from given table by table_name
    # returns tuples -> ((id, ...entry data...),...)

    db_table = conn.execute(
        f"SELECT * FROM {table_name}"
    ).fetchall()

    return db_table



def db_describe_table(conn, table_name):
    # calls db and returns table description of given table by table_name
    # returns tuples -> ((coloumn_var, ...coloum settings...),...)

    db_table_description = conn.execute(
        f"DESCRIBE {table_name}"
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
        f"SELECT * FROM {table_name} WHERE {id_name}={id_value}"
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
