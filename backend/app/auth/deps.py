from fastapi import Request, HTTPException, Depends
from app.auth.jwt_handler import decode_token

def get_current_user(request: Request):
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not logged in")

    try:
        payload = decode_token(token)
        return payload  # contains id, role, exp
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def role_required(role: str):
    def checker(user = Depends(get_current_user)):
        if user.get("role") != role:
            raise HTTPException(status_code=403, detail="Not allowed")
        return user
    return checker
