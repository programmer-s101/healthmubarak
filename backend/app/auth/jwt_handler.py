import jwt
from datetime import datetime, timedelta
from typing import Dict

SECRET = "SUPER_SECRET_KEY"  # move to env later
ALGO = "HS256"
EXP_DAYS = 7

def create_token(user: Dict) -> str:
    payload = {
        "id": user.get("id") if isinstance(user, dict) else getattr(user, "id"),
        "role": user.get("role") if isinstance(user, dict) else getattr(user, "role"),
        "exp": datetime.utcnow() + timedelta(days=EXP_DAYS)
    }
    return jwt.encode(payload, SECRET, algorithm=ALGO)

def decode_token(token: str) -> Dict:
    # returns payload as dict or raises jwt exceptions
    return jwt.decode(token, SECRET, algorithms=[ALGO])
