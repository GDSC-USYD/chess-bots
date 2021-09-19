import jwt
import os
from datetime import datetime, timedelta



def decode_auth_token(auth_token):
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, os.environ["DB_PASS"], algorithms=["HS256"])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please login again.'
    except jwt.InvalidTokenError as e:
        print(e)
        return 'Invalid token. Please login again.'
    except Exception as e:
        print(e)
        return str(e)



def encode_auth_token(player_id):
    """
    Generates the Auth Token
    :return: string
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
