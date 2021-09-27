# Functions which support authentication and encryption
import jwt
import os
from datetime import datetime, timedelta
#from passlib.hash import sha256_crypt



def decode_auth_token(auth_token):
    """
    Decodes the auth token and checks signature is valid
    Returns -> (id, auth_status) | (Exception, auth_status)
    """
    try:
        payload = jwt.decode(auth_token, os.environ["DB_PASS"], algorithms=["HS256"])
        return (payload['sub'], "OK")
    except jwt.ExpiredSignatureError:
        return ('Signature expired. Please login again.', "EXPIRED")
    except jwt.InvalidTokenError as e:
        #print(e)
        return ('Invalid token. Please login again.', "INVALID")
    except Exception as e:
        #print(e)
        return (str(e), "ERROR")



def encode_auth_token(player_id):
    """
    Generates the JWT and signs with secret
    Returns -> JWT
    """
    try:
        payload = {
            'exp': datetime.utcnow() + timedelta(days=0, seconds=1200),
            'iat': datetime.utcnow(),
            'sub': player_id
        }
        return jwt.encode(
            payload,
            os.environ["DB_PASS"], # secret key
            algorithm='HS256'
        )
    except Exception as e:
        return e
