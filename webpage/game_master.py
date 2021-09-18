# Launched by scheduler
#
# 1. (DB) requests all player GDrive links from DB
# 2. downloads all player models from GDrive link
#   i. checks/handles file error cases and sets flags if invalid
# 3. creates game schedule where all players verse each other once
# 4. versus the players/models according to schedule
#    i. tracks/calculates game data such as num moves, pieces, player scores, num moves
# 5. (DB) sends game data and player data for this batch into DB


import os
import pymysql.cursors
import requests
from datetime import datetime


#### put in own functions file


def download_gdrive_file(id, destination):
    def get_confirm_token(response):
        for key, value in response.cookies.items():
            if key.startswith('download_warning'):
                return value

        return None

    def save_response_content(response, destination):
        CHUNK_SIZE = 32768

        with open(destination, "wb") as f:
            for chunk in response.iter_content(CHUNK_SIZE):
                if chunk: # filter out keep-alive new chunks
                    f.write(chunk)

    URL = "https://docs.google.com/uc?export=download"

    try:
        session = requests.Session()

        response = session.get(URL, params = { 'id' : id }, stream = True)
        token = get_confirm_token(response)

        if token:
            params = { 'id' : id, 'confirm' : token }
            response = session.get(URL, params = params, stream = True)

        response.raise_for_status()

        save_response_content(response, destination)

        return destination

    except requests.exceptions.RequestException as e:
        print(e)

        return None


def extract_url_id(url):
    #needs to be rewritten to extract!!!
    temp = "1vTnYdYU5tJOOYlWVG1ct9Lb9aTTYON1A"
    url_id = temp
    return url_id


#### put in own file functions ^^^


class Match:
    """
    Instance of a chess match. Just used as storage for now.
    """
    def __init__(self, player_1_id, player_1_score, player_2_id, player_2_score, pgn, batch_id, date, time, winner_id, status_flag):
        self.player_1_id = player_1_id
        self.player_2_id = player_2_id
        self.player_1_score = None
        self.player_2_score = None
        self.pgn = None
        self.batch_id = None
        self.date, self.time = self.get_date_time()
        self.winner_id = None
        self.status_flag = status_flag


    def get_date_time(self):
        """
        Returns date in format DATE and time in format TIME that db can accept
        """
        now = datetime.now()
        date = now.strftime("%Y-%m-%d")
        time = now.strftime("%H:%M:%S")

        return date, time


class Player:
    """
    Instance of a player. Just used as storage for now.
    """
    def __init__(self, player_id, name, elo_score, model_url, status_flag):
        self.player_id = player_id
        self.name = name
        self.elo_score = elo_score
        self.model_url = model_url
        self.status_flag = status_flag # reset to zero every new VM instance?
        self.model_path = None
        self.scores = [] #list of their match scores (used to calculate elo)
        # status flags:
        # 0 just initialised
        # 1 model downloaded without error (ready to verse)
        # 2 finished AOK
        # -1 model could not be downloaded
        # -2 problem with using model in chess match
        # -3 other error (feel free to add more flags)



class ChessGameMaster:
    """
    Downloads player AI models, conducts chess games and records game data
    """
    def __init__(self, conn):
        self.conn = conn
        self.players = self.initialise_players()
        self.matches_data = None
        self.batch_id = None
        self.match_schedule = self.create_match_schedule()


    def initialise_players(self):
        """
        Store players as objects in list and returns list.
        Tries to download models for players also.
        """

        players_data = self.get_players_data()

        # instantiate player objects with downloaded player data
        players = []
        for player_id in players_data.keys():
            player_data = players_data[player_id]
            players.append(Player(player_id, player_data[0], player_data[1], player_data[2], player_data[3]))


        # download models for each player
        self.download_models(players)

        return players


    def download_models(self, players):
        """
        Downloads models for players from their model_url.
        Sets flags if download succeeds or fails.
        """
        if not os.path.exists('models'):
            os.makedirs('models')

        for player in players:

            url_id = extract_url_id(player.model_url) #e.g "1vTnYdYU5tJOOYlWVG1ct9Lb9aTTYON1A"

            destination = "models/" + str(player.player_id) + ".h5"

            player.model_path = download_gdrive_file(url_id, destination)
            # set status flag for model download
            if player.model_path == None:
                player.status_flag = -1 # error downloading model file
            else:
                player.status_flag = 1 # downloaded model file ok


    def get_players_data(self):
        """
        Calls database retrieval function and returns dictionary of all player data (NOT model_path)

        Returns -> dict{key:value} -> players_data{player_id:[name, elo_score, model_url, status_flag]}
        where:
        player_id: int Non Null Primary Key
        name: string (50)
        elo_score: int
        model_url: string (255)
        status_flag: int
        """

        players_data = db_retrieve_players_data()

        return players_data


    def print_players(self):
        for player in self.players:
            print(f"Name: {player.name}, ID: {player.player_id}, ELO score: {player.elo_score}, Model Path: {player.model_path}, Status: {player.status_flag}")


    def update_players_data(self):
        """
        Called at end of all chess games.

        Calls db function to upload new player data to database
        """
        for player in self.players:
            db_update_player_data(player)


    def update_matches_data(self):
        """
        db_update_player_data
        """
        db_update_matches_data(self.batch_id, self.matches_data)


    def get_batch_id(self):
        """
        Returns batch_id. If unknown finds latest batch_id from database.
        """
        if self.batch_id == None:
            return db_get_batch_id()
        else:
            return self.batch_id

    def create_match_schedule(self):
        """
        Creates an interable which gives match schedule of players.

        Must only add players to schedule with status_flag > 0
        """
        print("running")
        ready_players = [p for p in self.players if p.status_flag > 0]

        match_schedule_list = []

        # create unique pairings of all ready players
        i = 0
        j = 0
        while i < len(ready_players):
            for j in range(i + 1, len(ready_players)):
                match_schedule_list.append([ready_players[i], ready_players[j]])

            i += 1

        match_schedule_tuple = tuple(match_schedule_list)
        return match_schedule_tuple #iter(match_schedule_tuple)


    def play_chess(self, player_1, player_2):
        """
        Plays a game of chess between two provided players.

        Should create a new Match object for this chess match
        Should also calculate a score for the players (adds to Match object and player.scores list)

        anything else important
        """

        pass


    def run(self):
        """
        After init calls game functions and database functions
        """
        
        self.print_players()

        # can begin playing chess!
        #creates schedule of chess games

        for player_1, player_2 in self.match_schedule:
            print(f"Versing {player_1.name} and {player_2.name}")

            # plays games
            self.play_chess(player_1, player_2)

            # functions extract_url_id()
            # and play_chess are the only needing implementation
            # besides the db functions (I believe. Feel free to complete
            # more!)


        # finished games

        # update database
        self.update_players_data() #uploads all player object data to db
        self.update_matches_data() #uploads all matches object data to db

        # end VM instance
        self.conn.close()


def main():
    chess_game_master = ChessGameMaster()
    chess_game_master.run()


if __name__ == "__main__":
    main()
