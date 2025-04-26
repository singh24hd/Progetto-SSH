from fastapi import FastAPI, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from . import crud

# Inizializzazione database
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configurazione CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurazione autenticazione
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
SECRET_KEY = "your_secret_key"  # Sostituisci con una chiave sicura!
ALGORITHM = "HS256"

# Dipendenze
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"[DEBUG] Token payload: {payload}")  # Log del payload
        
        user_id = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
            
        user = crud.get_user_by_id(db, user_id=user_id)
        if user is None:
            raise credentials_exception
            
        print(f"[DEBUG] Ruolo DB: {user.ruolo} | Ruolo Token: {payload.get('role')}")
        return user
        
    except JWTError as e:
        print(f"[ERROR] JWT validation failed: {str(e)}")
        raise credentials_exception

# Endpoint di login
@app.post("/login", response_model=schemas.TokenResponse)
def login(form_data: schemas.LoginForm, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    
    # Crea token con ruolo standardizzato
    token_data = {
        "sub": user.email,
        "user_id": user.id,
        "role": "student" if user.ruolo.lower().startswith("student") else "teacher"
    }
    
    access_token = crud.create_access_token(data=token_data)
    
    return {
        "access_token": access_token,
        "role": token_data["role"]  # Restituisci lo stesso ruolo del token
    }

# Endpoint profilo
@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    print(f"[DEBUG] Token validato per: {current_user.email}")  # Verifica
    
    return schemas.UserResponse(
        id=current_user.id,
        email=current_user.email,
        nome=current_user.nome,
        cognome=current_user.cognome,
        data_nasc=current_user.data_nasc,
        luogo_nasc=current_user.luogo_nasc,
        nazionalità=current_user.nazionalità,
        telefono=current_user.telefono,
        indirizzo=current_user.indirizzo,
        cap=current_user.cap,
        citta=current_user.citta,
        prov=current_user.prov,
        cod_fisc=current_user.cod_fisc,
        role="student"  # Forza valore coerente con il token
    )

# Endpoint di registrazione
@app.post("/register/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)