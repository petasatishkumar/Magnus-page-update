from datetime import date, datetime
from typing import Literal

from bson import ObjectId
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware


MONGODB_URI = "mongodb://localhost:27017"
DATABASE_NAME = "magnus_db"
COLLECTION_NAME = "people"


client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]
people_collection = db[COLLECTION_NAME]


app = FastAPI(title="People API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PersonCreate(BaseModel):
    first_name: str = Field
    last_name: str = Field
    mobile_no: str = Field
    email_id: EmailStr
    gender: Literal["Male", "Female", "Other"]
    birth_date: date
    country: str = Field
    city: str = Field
    course : str = Field


def serialize_person(doc: dict) -> dict:
    return {
        "_id": str(doc["_id"]),
        "first_name": doc.get("first_name", ""),
        "last_name": doc.get("last_name", ""),
        "mobile_no": doc.get("mobile_no", ""),
        "email_id": doc.get("email_id", ""),
        "gender": doc.get("gender", ""),
        "birth_date": doc.get("birth_date").date().isoformat() if doc.get("birth_date") else "",
        "country": doc.get("country", ""),
        "city": doc.get("city", ""),
        "course": doc.get("course", ""),
    }


@app.get("/people")
def list_people():
    people = people_collection.find().sort("_id", -1)
    return [serialize_person(person) for person in people]


@app.post("/people")
def create_person(payload: PersonCreate):

    existing_user = people_collection.find_one({"email_id": payload.email_id})
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already exists")

    doc = payload.model_dump()

    # FIX: convert date → datetime for MongoDB
    doc["birth_date"] = datetime.combine(doc["birth_date"], datetime.min.time())

    result = people_collection.insert_one(doc)

    return {
        "message": "Details saved successfully",
        "id": str(result.inserted_id),
    }


@app.put("/people/{person_id}")
def update_person(person_id: str, payload: PersonCreate):

    if not ObjectId.is_valid(person_id):
        raise HTTPException(status_code=400, detail="Invalid person ID")

    doc = payload.model_dump()
    doc["birth_date"] = datetime.combine(doc["birth_date"], datetime.min.time())

    result = people_collection.update_one(
        {"_id": ObjectId(person_id)},
        {"$set": doc}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Person not found")

    return {"message": "Person updated successfully"}

@app.delete("/people/{person_id}")
def delete_person(person_id: str):

    if not ObjectId.is_valid(person_id):
        raise HTTPException(status_code=400, detail="Invalid person ID")

    result = people_collection.delete_one({"_id": ObjectId(person_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Person not found")

    return {"message": "Person deleted successfully"}
