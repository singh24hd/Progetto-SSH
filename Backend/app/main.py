from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from . import crud

# Crea tutte le tabelle nel database
models.Base.metadata.create_all(bind=engine)

# Impostazione FastAPI
app = FastAPI()

# Permettere il CORS per il frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Sostituisci con l'URL del tuo frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Impostazioni di sicurezza per l'OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Funzione per ottenere una sessione del DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Funzione per ottenere l'utente corrente (dalla JWT)
SECRET_KEY = "your_secret_key"  # Dovresti usare una chiave segreta sicura
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = crud.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception
    return user

# Endpoint di registrazione
@app.post("/register/", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

# Endpoint di login (autenticazione)
@app.post("/login", response_model=schemas.TokenResponse)
def login(form_data: schemas.LoginForm, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form_data.email, form_data.password)  # Usa email per login
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Genera il token JWT
    access_token = crud.create_access_token(
        data={"sub": user.email, "user_id": user.id, "role": user.ruolo}
    )
    
    # Mappa il ruolo in italiano (studente/teacher) per il frontend
    role = "student" if user.ruolo.lower() == "studente" else "teacher"
    
    return {"access_token": access_token, "role": role}

# Endpoint per ottenere i dettagli dell'utente corrente (profilo)
@app.get("/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
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
        role = "student" if "student" in current_user.ruolo.lower() else "teacher"
    )