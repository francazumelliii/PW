from collections import defaultdict
from typing import List
from fastapi import FastAPI, Request, HTTPException, Depends, Query, Header, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error as MySQLError 
import logging
from datetime import datetime, date
from functools import wraps
from pydantic import BaseModel
import secrets
import json


app = FastAPI()

# Configurazione OAuth2
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Configurazione CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE","PATCH"],
    allow_headers=["*"],
)

# Logging service
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Db configuration
db_config = {
    'host': "localhost",
    'user': "root",
    'password': "MysqlRoot24",
    'database': "restaurants",
    'port': 3306
}

# Token generation
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 240

# Db connection
def get_db_connection():
    try:
        conn = mysql.connector.connect(**db_config)
        if conn.is_connected():
            return conn
    except mysql.connector.Error as e:
        logger.error(f"Error connecting to database: {e}")
    return None

# Class for signin
class SignInRequest(BaseModel):
    email: str
    password: str

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}")
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error"}
    )

# Access token creation
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Token verifying
async def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")

#signup function
@app.post("/api/v1/signup")
async def signup(request: Request):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            return JSONResponse(content={"error": "Could not connect to the database"}, status_code=500)

        data = await request.json()
        name = data.get("name")
        surname = data.get("surname")
        email = data.get("email")
        password = data.get("password")

        if not name or not surname or not email or not password:
            return JSONResponse(content={"error": "Missing required fields"}, status_code=400)

        cursor = conn.cursor(dictionary=True)
        #check if user already exist
        check_user_query = "SELECT * FROM customer WHERE mail = %s"
        cursor.execute(check_user_query, (email,))
        existing_user = cursor.fetchone()

        if existing_user:
            return JSONResponse(content={"error": "User with this email already exists"},status_code=202)

        hashed_password = pwd_context.hash(password)

        #if not exist, insert new user
        insert_user_query = "INSERT INTO customer (name, surname, mail, password) VALUES (%s, %s, %s, %s)"
        cursor.execute(insert_user_query, (name, surname, email, hashed_password))
        conn.commit()

        # create JWT token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)



        return JSONResponse(content={"access_token": access_token, "token_type": "bearer"}, status_code=201)
    except mysql.connector.Error as err:
        return JSONResponse(content={"error": f"Error in retrieving data: {err}"}, status_code=500)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#login function
@app.post("/api/v1/signin")
async def signin(request: SignInRequest):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        
        # Query per ottenere password e tipo di utente
        query = """
        SELECT password, 'entrepreneur' AS user_type FROM entrepreneur WHERE mail = %s
        UNION
        SELECT password, 'admin' AS user_type FROM admin WHERE mail = %s
        UNION
        SELECT password, 'customer' AS user_type FROM customer WHERE mail = %s
        """
        cursor.execute(query, (request.email, request.email, request.email))
        user = cursor.fetchone()

        if not user or not pwd_context.verify(request.password, user['password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")

        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(data={"sub": request.email}, expires_delta=access_token_expires)
        return {"access_token": access_token, "token_type": "bearer", "user_type": user['user_type']}

    except mysql.connector.Error as db_err:
        logger.error(f"Database error: {db_err}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
#post for token verification frontend
@app.get("/api/v1/token")
async def verify_token_route(authorization: str = Header(None)):
    if authorization is None:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    # Divide l'header in schema e token solo se presente lo spazio
    auth_parts = authorization.split()
    if len(auth_parts) != 2:
        raise HTTPException(status_code=401, detail="Invalid Authorization header format")
    
    scheme, token = auth_parts
    
    try:
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return {"valid": True}
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")

#base sql 
baseSQL = """
SELECT 
    l.id AS id_locale,
    l.name AS nome_locale,
    l.via AS via_locale,
    l.civico AS civico_locale,
    l.posti_max AS posti_max_locale,
    l.descrizione AS descrizione_locale,
    l.banner AS banner_locale,
    c.id AS id_comune,
    c.name AS nome_comune,
    p.id AS id_provincia,
    p.name AS nome_provincia,
    p.sigla AS sigla_provincia,
    r.id AS id_regione,
    r.name AS nome_regione,
    a.cf AS cf_admin,
    a.password AS password_admin,
    a.name AS nome_admin,
    a.cogname AS cognome_admin,
    a.email AS email_admin,
    az.piva AS piva_azienda,
    az.nome AS nome_azienda,
    i.cf AS cf_imprenditore,
    i.nome AS nome_imprenditore,
    i.cognome AS cognome_imprenditore,
    i.telefono AS telefono_imprenditore,
    img.url AS img_url
FROM locale l
INNER JOIN comuni c ON c.id = l.id_comune  
INNER JOIN province p ON p.id = c.id_provincia 
INNER JOIN regioni r ON r.id = p.id_regione 
INNER JOIN admin a ON a.id_locale = l.id 
INNER JOIN azienda az ON az.piva = l.piva_azienda 
INNER JOIN imprenditore i ON i.cf = az.cf_imprenditore
INNER JOIN imgs img ON img.id_locale = l.id
INNER JOIN menu m ON m.id_locale = l.id 
INNER JOIN piatto pi ON pi.id_menu = m.id

"""
#
#---------------- GET ALL RESTAURANTS IN DB -----------------
#

@app.get("/api/v1/restaurant")
async def get_all_restaurants(request: Request, token: str = Depends(verify_token), id: int = Query(None)):
    logger.info("Attempting to retrieve all restaurants...")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        query= """
        SELECT 
            restaurant.name AS restaurant_name, restaurant.rating, restaurant.street, restaurant.street_number, restaurant.latitude,
            restaurant.longitude, restaurant.max_chairs, restaurant.description, restaurant.banner,restaurant.restaurant_id,
            admin.admin_id, admin.name AS admin_name, admin.surname AS admin_surname,
            company.name AS company_name, company.vat_n, company.address AS company_address, company.telephone AS company_telephone,
            village.name AS village_name,
            county.name AS county_name, county.code AS county_code,
            region.name AS region_name,
            imgs.path AS img_path
        FROM restaurant 
        INNER JOIN admin ON admin.restaurant_id = restaurant.restaurant_id 
        INNER JOIN company ON company.company_id = restaurant.company_id 
        INNER JOIN village ON village.village_id = restaurant.village_id 
        INNER JOIN county ON county.county_id = village.county_id 
        INNER JOIN region ON region.region_id = county.region_id
        INNER JOIN imgs ON imgs.restaurant_id = restaurant.restaurant_id
        WHERE imgs.priority = 1"""
        query += " AND restaurant.restaurant_id = " + str(id) if id != None else ""
        query += " GROUP BY restaurant.restaurant_id"
        
        cursor.execute(query)   
        results = cursor.fetchall()
        response = []
        for row in results: 
            restaurant_data = {
                "restaurant": {
                    "id": row['restaurant_id'],
                    "name": row["restaurant_name"],
                    "rating": row["rating"],
                    "street": row["street"],
                    "street_number": row["street_number"],
                    "max_chairs": row['max_chairs'],
                    "description": row['description'],
                    "banner": row['banner']
                },
                "admin": {
                    "id": row['admin_id'],
                    "name": row['admin_name'],
                    "surname": row['admin_surname']
                },
                "company": {
                    "name": row['company_name'],
                    "vat": row["vat_n"],
                    "address": row['company_address'],
                    "telephone": row['company_telephone']
                },
                "coords": {
                    "latitude": row["latitude"],
                    "longitude": row['longitude'],
                    "village": row["village_name"],
                    "county": row["county_name"],
                    "county_code": row["county_code"],
                    "region": row["region_name"]
                },
                "img": {
                    "path": row['img_path']
                }
            }
            response.append(restaurant_data)
           

        
        return JSONResponse(content={"success": True, "data": response}, status_code=200)
    except mysql.connector.Error as err:
        logger.error(f"Database error: {err}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#search restaurants
@app.get("/search_restaurants")
async def search_restaurants(
    nome_locale: str = Query(None), 
    nome_comune: str = Query(None), 
    nome_provincia: str = Query(None), 
    nome_regione: str = Query(None), 
    token: str = Depends(verify_token)
):
    logger.info(f"Searching restaurants with criteria - locale: {nome_locale}, comune: {nome_comune}, provincia: {nome_provincia}, regione: {nome_regione}")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        query = baseSQL + " WHERE 1=1"
        params = []
        
        if nome_locale:
            query += " AND l.nome LIKE %s"
            params.append(f"%{nome_locale}%")
        if nome_comune:
            query += " AND c.nome LIKE %s"
            params.append(f"%{nome_comune}%")
        if nome_provincia:
            query += " AND p.nome LIKE %s"
            params.append(f"%{nome_provincia}%")
        if nome_regione:
            query += " AND r.nome LIKE %s"
            params.append(f"%{nome_regione}%")
        
        query += "GROUP BY locale.id"
        cursor.execute(query, tuple(params))
        results = cursor.fetchall()
        
        if not results:
            logger.info("No restaurants found with given criteria")
            return JSONResponse(content={"message": "No restaurants found with given criteria"}, status_code=200)
        
        return JSONResponse(content= results, status_code=200)
    except mysql.connector.Error as err:
        logger.error(f"Database error: {err}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

#get restaurant from id
@app.get("/api/v1/restaurant")
async def get_restaurant_from_id(id:str | int = Query(""), token: str = Depends(verify_token)):
    logger.info("Attempting to retrieve all restaurants...")
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if not conn:
            logger.error("Database connection failed")
            raise HTTPException(status_code=500, detail="Database connection failed")
        
        cursor = conn.cursor(dictionary=True)
        query= """
        SELECT 
            restaurant.name AS restaurant_name, restaurant.rating, restaurant.street, restaurant.street_number, restaurant.latitude,
            restaurant.longitude, restaurant.max_chairs, restaurant.description, restaurant.banner,restaurant.restaurant_id,
            admin.admin_id, admin.name AS admin_name, admin.surname AS admin_surname,
            company.name AS company_name, company.vat_n, company.address AS company_address, company.telephone AS company_telephone,
            village.name AS village_name,
            county.name AS county_name, county.code AS county_code,
            region.name AS region_name,
            imgs.path AS img_path
        FROM restaurant 
        INNER JOIN admin ON admin.restaurant_id = restaurant.restaurant_id 
        INNER JOIN company ON company.company_id = restaurant.company_id 
        INNER JOIN village ON village.village_id = restaurant.village_id 
        INNER JOIN county ON county.county_id = village.county_id 
        INNER JOIN region ON region.region_id = county.region_id
        INNER JOIN imgs ON imgs.restaurant_id = restaurant.restaurant_id
        WHERE imgs.priority = 1 AND restaurant.restaurant_id = %s
        GROUP BY restaurant.restaurant_id"""
        
        cursor.execute(query,(id,))   
        results = cursor.fetchone()
        restaurant_data = {
            "restaurant": {
                "id": results['restaurant_id'],
                "name": results["restaurant_name"],
                "rating": results["rating"],
                "street": results["street"],
                "street_number": results["street_number"],
                "max_chairs": results['max_chairs'],
                "description": results['description'],
                "banner": results['banner']
            },
            "admin": {
                "id": results['admin_id'],
                "name": results['admin_name'],
                "surname": results['admin_surname']
            },
            "company": {
                "name": results['company_name'],
                "vat": results["vat_n"],
                "address": results['company_address'],
                "telephone": results['company_telephone']
            },
            "coords": {
                "latitude": results["latitude"],
                "longitude": results['longitude'],
                "village": results["village_name"],
                "county": results["county_name"],
                "county_code": results["county_code"],
                "region": results["region_name"]
            },
            "img": {
                "path": results['img_path']
            }
        }      

        
        return JSONResponse(content={"success": True, "data": restaurant_data}, status_code=200)
    except mysql.connector.Error as err:
        logger.error(f"Database error: {err}")
        raise HTTPException(status_code=500, detail="Database error")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


#test function
@app.get("/ping")
async def ping():
    return JSONResponse(content="pong")

#get all turns function
@app.get("/api/v1/turns")
async def get_all_turns(request: Request, token: str = Depends(verify_token)):

    conn = get_db_connection()
    if not conn:
        return JSONResponse(content={"error": "Could not connect to the database"}, status_code=500)

    try:
        cursor = conn.cursor(dictionary=True)
        query = "SELECT turn_id, TIME_FORMAT(start_time, '%H:%i:%s') AS start_time, TIME_FORMAT(end_time, '%H:%i:%s') AS end_time FROM turn"
        cursor.execute(query)
        result = cursor.fetchall()
        return JSONResponse(content={"success": True, "data": result})
    except Error as err:
        logger.error(f"Error retrieving data: {err}")
        return JSONResponse(content={"error": f"Errore nel recupero dei dati: {err}"}, status_code=500)
    finally:
        cursor.close()
        conn.close()


# class for available tables in restaurant
class TableCheckRequest(BaseModel):
    date: str
    turn: int
    id: int
    
# tables availability function
@app.get("/api/v1/tables")
async def check_tables(date: str, turn: str | int, id: str | int,token: str = Depends(verify_token)):
    try:
        conn = get_db_connection()
        if not conn:
            return JSONResponse(content={"error": "Could not connect to the database"}, status_code=500)
        cursor = conn.cursor()

        query = """
        SELECT 
            SUM(reservation.quantity) AS total_reserved,
            restaurant.max_chairs AS max
        FROM 
            restaurant 
        LEFT JOIN 
            reservation ON reservation.restaurant_id = restaurant.restaurant_id AND reservation.date = %s AND reservation.turn_id = %s
        WHERE 
            restaurant.restaurant_id = %s
        GROUP BY 
            restaurant.max_chairs
        """

        cursor.execute(query, (date,turn,id))
        result = cursor.fetchone()

        if not result:
            max_seats_query = """
            SELECT max_chairs FROM restaurant WHERE restaurant_id = %s
            """
            cursor.execute(max_seats_query, (id,))
            max_seats_result = cursor.fetchone()
            if max_seats_result:
                return JSONResponse(content={"available_seats": max_seats_result[0]}, status_code=200)
            else:
                return JSONResponse(content={"message": "No results found"}, status_code=200)

        total_reserved = result[0] or 0  
        max_seats = result[1] or 0 
        available_seats = max_seats - total_reserved

        return JSONResponse(content={"success": True, "data":{"available_seats" : available_seats}}, status_code=200)

    except MySQLError as err:
        logging.error(f"Error retrieving data: {err}")
        return JSONResponse(content={"error": f"Error retrieving data: {err}"}, status_code=500)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


def serialize_date(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError("Type not serializable")

# booking table function
@app.post("/api/v1/restaurant/reservation")
async def insert_reservation(request: Request, token: str = Depends(verify_token), user_mail: str = Depends(verify_token)):
    cursor = None
    conn = None
    try:
        data = await request.json()
        conn = get_db_connection()
        mail = data.get("mail")
        date_str = data.get("date")
        date_obj = datetime.strptime(date_str, "%Y-%m-%d").date() if date_str else None
        quantity = data.get("quantity")
        turn_id = data.get("turn_id")
        restaurant_id = data.get("restaurant_id")

        cursor = conn.cursor(dictionary=True)
        query = """SELECT customer_id AS id, 'customer' AS user_type FROM customer WHERE mail = %s 
                    UNION SELECT admin_id AS id, 'admin' AS user_type FROM admin WHERE mail = %s """
                    
        cursor.execute(query,(user_mail, user_mail))
        customer_id = cursor.fetchone()['id']
        query = "INSERT INTO reservation (mail, date, quantity, turn_id, restaurant_id, customer_id, confirmed) VALUES (%s, %s, %s, %s, %s, %s, 1)"
        cursor.execute(query, (mail, date_obj, quantity, turn_id, restaurant_id, customer_id))
        conn.commit()
        
        reservation_id = cursor.lastrowid
        cursor.execute("SELECT * FROM reservation WHERE reservation_id = %s", (reservation_id, ))
        result = cursor.fetchone()

        # Serializza il risultato gestendo le date
        result_json = json.dumps(result, default=serialize_date)
        result_dict = json.loads(result_json)
        
        return JSONResponse(content={"success": True, "data": result_dict}, status_code=200)
    except mysql.connector.Error as err:
        return JSONResponse(content={"error": f"Error in retrieving data: {err}"}, status_code=501)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
# get all imgs url 
@app.get("/api/v1/imgs")
async def get_all_imgs(id: str = Query(..., description="ID locale"), token: str = Depends(verify_token)): 
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM imgs WHERE id_locale = %s"
        cursor.execute(query, (id,))
        result = cursor.fetchall()
        return JSONResponse(content = result)
    except mysql.connector.Error as err:
        return JSONResponse(content={"Error": f"Error in retrieving data: {err}"},status_code=400)
        
    finally: 
        cursor.close()
        conn.close()
        
# get nearest restaurants by location
#@app.get("/api/v1/restaurant/nearest")
async def get_nearest(village: str = Query(""),county: str = Query(""), state: str = Query(""), token: str = Depends(verify_token)): 
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = baseSQL + " WHERE "
        
        conditions = []
        if village:
            conditions.append(f"c.nome LIKE '{village}'")
        if county:
            conditions.append(f"p.nome LIKE '{county}'")
        if state:
            conditions.append(f"r.nome LIKE '{state}'")
        
        # Unisci le condizioni con AND
        query += " AND ".join(conditions)
        query += " GROUP BY l.id"
        
        cursor.execute(query)
        result = cursor.fetchall()
        if result: 
            response = {"success" : True, "data": result}
        else: 
            response = {"success" : False}
        
        return JSONResponse(content = response)
        
    except mysql.connector.Error as err:
        return JSONResponse(content={"Error": f"Error in retrieving data: {err}"},status_code=400)
    finally: 
        cursor.close()
        conn.close()
      
@app.get("/api/v1/restaurant/nearest")
async def get_nearest_restaurants(latitude: float = Query(1), longitude: float = Query(), county: str = Query(), token: str = Depends(verify_token)):
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT restaurant.name AS restaurant_name,restaurant.rating,restaurant.street,restaurant.street_number,
            restaurant.restaurant_id,
            restaurant.latitude,restaurant.longitude,restaurant.max_chairs,restaurant.description,restaurant.banner,
            admin.admin_id,admin.name AS admin_name,admin.surname AS admin_surname,company.name AS company_name,
            company.vat_n,company.address AS company_address,company.telephone AS company_telephone,village.name AS village_name,
            county.name AS county_name,county.code AS county_code,region.name AS region_name,
            imgs.path AS img_path,
            SQRT(POW(restaurant.latitude - %s, 2) + POW(restaurant.longitude - %s, 2)) AS distance
            FROM restaurant 
            INNER JOIN admin ON admin.restaurant_id = restaurant.restaurant_id 
            INNER JOIN company ON company.company_id = restaurant.company_id 
            INNER JOIN village ON village.village_id = restaurant.village_id 
            INNER JOIN county ON county.county_id = village.county_id 
            INNER JOIN region ON region.region_id = county.region_id
            INNER JOIN imgs ON imgs.restaurant_id = restaurant.restaurant_id
            WHERE county.name LIKE %s AND imgs.priority = '1'
            GROUP BY restaurant.restaurant_id 
            ORDER BY distance"""
            
        cursor.execute(query, (latitude, longitude, county))
        print(latitude,longitude,county)
        results = cursor.fetchall()
        response = []
        for row in results: 
            restaurant_data = {
                "restaurant": {
                    "id": row['restaurant_id'],
                    "name": row["restaurant_name"],
                    "rating": row["rating"],
                    "street": row["street"],
                    "street_number": row["street_number"],
                    "max_chairs": row['max_chairs'],
                    "description": row['description'],
                    "banner": row['banner']
                },
                "admin": {
                    "id": row['admin_id'],
                    "name": row['admin_name'],
                    "surname": row['admin_surname']
                },
                "company": {
                    "name": row['company_name'],
                    "vat": row["vat_n"],
                    "address": row['company_address'],
                    "telephone": row['company_telephone']
                },
                "coords": {
                    "latitude": row["latitude"],
                    "longitude": row['longitude'],
                    "village": row["village_name"],
                    "county": row["county_name"],
                    "county_code": row["county_code"],
                    "region": row["region_name"]
                },
                "img": {
                    "path": row['img_path']
                }
            }
            response.append(restaurant_data)
    
        return JSONResponse(content={"success" : True, "data": response}, status_code=200)        
        
    except MySQLError as err: 
        raise HTTPException(status_code=401, detail=f"Error retriving data: {err}")
    finally: 
        conn.close()
      
      
      
        
        
#get others restaurant in same county or village
@app.post("/api/v1/restaurant/others")
async def get_others(request: Request, token: str = Depends(verify_token)):
    conn = None
    cursor = None
    try:
        data = await request.json()
        ids = data.get("ids")
        village = data.get("village")
        county = data.get("county")
        
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Constructing the SQL query
        query = baseSQL + """
         WHERE (p.nome = %s OR c.nome = %s)
        AND l.id NOT IN ({}) GROUP BY l.id
        """.format(','.join(['%s'] * len(ids)))

        params = [county, village] + ids

        cursor.execute(query, params)
        result = cursor.fetchall()

        return JSONResponse(content=result, status_code=200)
    except mysql.connector.Error as err:
        return JSONResponse(content={"Error": f"Error in retrieving data: {err}"}, status_code=400)
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
#get email from token and get user
# importa le librerie necessarie
from fastapi import Depends, HTTPException
from mysql.connector import connect, Error
from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from datetime import datetime, timedelta


# Extract email from token
async def get_email_from_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Email not found in token")
        return email
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid JWT token")


# Configurazione del logger
logging.basicConfig(level=logging.INFO)


from fastapi import Header
async def get_email_from_token(authorization: str = Header(None)):
    try:
        if authorization is None:
            raise HTTPException(status_code=401, detail="Missing Authorization header")
        auth_parts = authorization.split()
        if len(auth_parts) != 2:
            raise HTTPException(status_code=401, detail="Invalid Authorization header format")
        
        scheme, token = auth_parts
        
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authorization scheme")
        
        # Verifica la firma del token e ottieni il payload
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Email non trovata nel token")
        
        return email
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Token JWT non valido")


#@app.get("/api/v1/user")
async def get_user_from_email(email: str = Depends(get_email_from_token)):
    conn = None
    try:
        logging.debug("Connessione al database...")
        conn = get_db_connection()

        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM customer WHERE mail = %s"
        cursor.execute(query, (email.lower(),))
        result = cursor.fetchone()
        
        user = {
                "mail" : result["mail"],
                "name" : result["name"],
                "surname" : result["surname"]
            }
        if result: 
            logging.debug("User not found")
            return JSONResponse(content={"success": True, "data": {"user": user}}, status_code=200)
        else:
            logging.error("User not found")
            raise HTTPException(status_code=404, detail="Utente non trovato")
    except Error as err:
        logging.error(f"Error retrieving data: {err}")
        raise HTTPException(status_code=400, detail=f"Error retrieving data: {err}")
    finally:
        if conn:
            conn.close()
            
            
@app.patch("/api/v1/user")
async def patch_user(request: Request, token: str = Depends(verify_token)): 
    try: 
        data = await request.json()
        name = data.get("name")
        surname = data.get("surname")
        mail = data.get("mail")

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "UPDATE customer SET name = %s, surname = %s WHERE mail = %s"
        cursor.execute(query, (name, surname, mail))
        conn.commit()
        
        if cursor.rowcount > 0:
            return JSONResponse(content={"success": True}, status_code=200)
        else: 
            return JSONResponse(content={"success": False}, status_code=401)
        
    except MySQLError as err: 
        raise HTTPException(status_code=400, detail=f"Errore nel recupero dei dati: {err}")
    finally: 
        if conn.is_connected():
            conn.close()
    
        
        
@app.get("/api/v1/restaurant/others")
async def get_others(ids: List[int] = Query(...), county: str = Query(""), village: str = Query(""), token = Depends(verify_token)): 
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = baseSQL + """
         WHERE (p.nome = %s OR c.nome = %s)
        AND l.id NOT IN ({}) GROUP BY l.id
        """.format(','.join(['%s'] * len(ids)))

        params = [county, village] + ids
        cursor.execute(query, params)
        result = cursor.fetchall()
        
        if result: 
            response = {"success": True, "data": result }
        else: 
            response = {"success": False}
        return JSONResponse(content = response)
    except MySQLError as err:
        raise HTTPException(status_code=400, detail=f"Error: {err}")
    finally: 
        conn.close()
        
        
@app.put("/api/v1/restaurant")
async def put_restaurant(request: Request, token:str = Depends(verify_token),id: int | str = Query("")): 
    data = await request.json()
    
    name = data.get("name")
    road = data.get("road")
    hn = data.get("hn")
    max_chairs = data.get("max_chairs")
    village_id = data.get("village_id")
    description = data.get("description")
    banner = data.get("banner")
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query_parts = []
        params = []

        if name:
            query_parts.append("name = %s")
            params.append(name)
        if road:
            query_parts.append("street = %s")
            params.append(road)
        if hn:
            query_parts.append("street_number = %s")
            params.append(hn)
        if max_chairs:
            query_parts.append("max_chairs = %s")
            params.append(max_chairs)
        if village_id:
            query_parts.append("village_id = %s")
            params.append(village_id)
        if description:
            query_parts.append("description = %s")
            params.append(description)
        if banner:
            query_parts.append("banner = %s")
            params.append(banner)
            
        query = "UPDATE restaurant SET " + ", ".join(query_parts)
        query += " WHERE id = %s"
        params.append(id)
        cursor.execute(query, params)
        conn.commit()
        
        logging.info(query)
        if cursor.rowcount > 0 : 
            response = {"success": True}
        else : 
            response = {"success": False}
        return JSONResponse(content = response)
    except MySQLError as err: 
        raise HTTPException(status_code=400, detail= f"Error: {err}")
    finally: 
        conn.close()
        
@app.get("/api/v1/restaurant/menu")
async def get_all_menu(token=Depends(verify_token), id: int = Query(None)):
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """SELECT 
                    menu.menu_id, menu.name, menu.description, menu.category
                    FROM menu 
                    
                    """
        if id != None: 
            query += " INNER JOIN restaurant ON restaurant.restaurant_id = menu.restaurant_id WHERE restaurant.restaurant_id = %s"
            cursor.execute(query,(id,))
        else: 
            cursor.execute(query)
        result = cursor.fetchall()
        menus = []
        print(query)
        for row in result: 
            query = """SELECT dish.description, dish.dish_id, dish.ingredients, dish.vegan, dish.lactose_free,
                        dish_category.name category_name, dish.name
                        FROM dish INNER JOIN menu ON dish.menu_id = menu.menu_id 
                        INNER JOIN dish_category ON dish_category.dish_category_id = dish.dish_category_id
                        WHERE menu.menu_id = %s """
            cursor.execute(query,(row['menu_id'], ))
            dish_res = cursor.fetchall()
            dishes = []
            for dish in dish_res: 
                dish = {
                    "id" : dish['dish_id'],
                    "name" : dish['name'],
                    "description" : dish['description'],
                    "ingredients" : dish['ingredients'],
                    "is_vegan" : True if dish['vegan'] == '1' else False,
                    "is_lactose_free" : True if dish['lactose_free'] == '1' else False,
                    "category_name" : dish['category_name']
                }
                dishes.append(dish)
            
            menu = {
                "id" : row['menu_id'],
                "name" : row['name'],
                "description" : row['description'],
                "category" : row['category'],
                "dishes" : dishes
            }
            menus.append(menu)
            
        return JSONResponse(content = {"success" : True, "data": menus}, status_code=200)
    except MySQLError as err: 
        raise HTTPException(status_code=501, detail = f"Error: {err}")
    finally: 
        conn.close()

@app.get("/api/v1/menu/dish")
async def get_dishes(id: int | str = Query(None), category: str = Query(None), vegan: bool = Query(False),lactose_free: bool = Query(False) ):
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary= True)
  
        query ="""
            SELECT dish.dish_id, dish.description, dish.ingredients, dish.vegan ,dish.lactose_free, dish.name,
                dish_category.dish_category_id, dish_category.name category_name
                FROM dish INNER JOIN dish_category ON dish_category.dish_category_id = dish.dish_category_id
                WHERE 1 = 1
        """
        if id != None: 
            query += " AND dish_id = " + id
        if category != None: 
            query += " AND dish.dish_category_id = " + category
        if vegan != False: 
            query += " AND dish.vegan = 1"
        if lactose_free != False: 
            query += " AND dish.lactose_free = 1"
        
        cursor.execute(query)
        result = cursor.fetchall()
        return JSONResponse(content = result, status_code=200 )
        
        
    except MySQLError as error: 
        raise HTTPException(status_code=501, detail=f"Error: {error}")
    finally: 
        conn.close()
        
        
        
@app.get("/api/v1/menu")
async def get_all_menu(token=Depends(verify_token), id: int = Query(None)):
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """SELECT 
                    menu.menu_id, menu.name, menu.description, menu.category
                    FROM menu 
                    
                    """
        if id != None: 
            query += " WHERE menu.menu_id = %s"
            cursor.execute(query,(id,))
        else: 
            cursor.execute(query)
        result = cursor.fetchall()
        menus = []
        print(query)
        for row in result: 
            query = """
                    SELECT dish.description, dish.dish_id, dish.ingredients, dish.vegan, dish.lactose_free,
                        dish_category.name category_name, dish.name
                    FROM dish INNER JOIN menu ON dish.menu_id = menu.menu_id 
                        INNER JOIN dish_category ON dish_category.dish_category_id = dish.dish_category_id
                        WHERE menu.menu_id = %s """
            cursor.execute(query,(row['menu_id'], ))
            dish_res = cursor.fetchall()
            dishes = []
            for dish in dish_res: 
                dish = {
                    "id" : dish['dish_id'],
                    "name" : dish['name'],
                    "description" : dish['description'],
                    "ingredients" : dish['ingredients'],
                    "is_vegan" : True if dish['vegan'] == '1' else False,
                    "is_lactose_free" : True if dish['lactose_free'] == '1' else False,
                    "category_name" : dish['category_name']
                }
                dishes.append(dish)
            
            menu = {
                "id" : row['menu_id'],
                "name" : row['name'],
                "description" : row['description'],
                "category" : row['category'],
                "dishes" : dishes
            }
            menus.append(menu)
            
        return JSONResponse(content = {"success" : True, "data": menus}, status_code=200)
    except MySQLError as err: 
        raise HTTPException(status_code=501, detail = f"Error: {err}")
    finally: 
        conn.close()

@app.get("/api/v1/user")
async def get_user(token = Depends(verify_token), role: str = Query(None), mail : str = Depends(verify_token)): 
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = "SELECT * FROM admin" if role=="admin" else "SELECT * FROM customer"
        query += " WHERE mail = %s"
        cursor.execute(query,(mail, ))
        print(query)
        result = cursor.fetchone()
        if result: 
            return JSONResponse(content = {"success":True, "data": result}, status_code=200)
        else: 
            return JSONResponse(content = {"success": False})
    except MySQLError as err:
        raise HTTPException(status_code=501, detail=f"Error retrieving data {err}")
    finally: 
        conn.close()





@app.get("/api/v1/list")
async def get_list(mail: str = Depends(verify_token), role: str = Query(None), token = Depends(verify_token)):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT list FROM " + role + " WHERE mail = %s"
        cursor.execute(query, (mail, ))
        result = cursor.fetchone()
        
        if result: 
            return JSONResponse(content = {"success": True, "data": result }, status_code=200)
        else: 
            return JSONResponse(content= {"success": False})
    except MySQLError as err: 
        raise HTTPException(detail = f"Error retrieving data: {err}", status_code=501)
    finally: 
        conn.close()
        


            
# Endpoint per ottenere le prenotazioni degli utenti (admin e customer)
@app.get("/api/v1/user/reservation")
async def get_users_reservation(token: str = Depends(verify_token), mail: str = Depends(verify_token)):
    try: 
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT *
            FROM (
                SELECT
                    'admin' AS user_type,
                    a.admin_id AS user_id,
                    a.name AS name,
                    a.surname AS surname,
                    a.mail AS email,
                    r.reservation_id,
                    DATE_FORMAT(r.date, '%Y-%m-%d') AS date,
                    r.quantity as quantity,
                    r.confirmed as confirmed,
                    r.mail as mail,
                    rest.restaurant_id,
                    rest.name AS restaurant_name,
                    TIME_FORMAT(t.start_time, '%H:%i') AS start_time,
                    TIME_FORMAT(t.end_time, '%H:%i') AS end_time,
                    rest.street,rest.street_number,
                    village.name village_name
                FROM admin AS a
                INNER JOIN reservation AS r ON r.customer_id = a.admin_id
                INNER JOIN restaurant AS rest ON rest.restaurant_id = r.restaurant_id
                INNER JOIN turn AS t ON r.turn_id = t.turn_id
                INNER JOIN village ON village.village_id = rest.village_id
                WHERE a.mail = %s
                UNION ALL
                SELECT
                    'customer' AS user_type,
                    c.customer_id AS user_id,
                    c.name AS name,
                    c.surname AS surname,
                    c.mail AS email,
                    r.reservation_id,
                    DATE_FORMAT(r.date, '%Y-%m-%d') AS date,
                    r.quantity as quantity,
                    r.confirmed as confirmed,
                    r.mail as mail,
                    rest.restaurant_id,
                    rest.name AS restaurant_name,
                    rest.street,rest.street_number,
                    village.name village_name,
                    TIME_FORMAT(t.start_time, '%H:%i') AS start_time,
                    TIME_FORMAT(t.end_time, '%H:%i') AS end_time
                FROM customer AS c
                INNER JOIN reservation AS r ON r.customer_id = c.customer_id
                INNER JOIN restaurant AS rest ON rest.restaurant_id = r.restaurant_id
                INNER JOIN turn AS t ON r.turn_id = t.turn_id
                INNER JOIN village ON rest.village_id = village.village_id
                WHERE c.mail = %s
            ) AS combined_results;
            """
        cursor.execute(query,(mail,mail))
        result = cursor.fetchall()
        if result:
            response = []

            for row in result:
                obj = {
                    "user": {
                        "id" : row['user_id'],
                        "name" : row['name'],
                        "surname": row['surname'],
                        "mail" : row['email']
                        },
                    "reservation": {
                        "id": row['reservation_id'],
                        "date": row['date'],
                        "quantity" : row['quantity'],
                        "confirmed" : row['confirmed'],
                        "mail": row['mail'],
                        "start_time": row['start_time'],
                        "end_time": row['end_time']
                        },
                    "restaurant" : {
                        "id": row['restaurant_id'],
                        "name": row['restaurant_name'],
                        "street": row["street"],
                        "street_number": row['street_number'],
                        "village": row['village_name']
                    }

                }
                response.append(obj)


            return JSONResponse(content={"success": True, "data": response}, status_code=200)
        else: 
            return JSONResponse(content={"success": False, "message": "No reservations found"}, status_code=200)
        
    except MySQLError as err: 
        raise HTTPException(status_code=501, detail=f"Error retrieving data {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
            
