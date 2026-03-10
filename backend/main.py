from datetime import date, datetime
from typing import Literal

from bson import ObjectId
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr, Field
from pymongo import MongoClient


MONGODB_URI = "mongodb://localhost:27017"
DATABASE_NAME = "magnus_db"
COLLECTION_NAME = "people"


client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]
people_collection = db[COLLECTION_NAME]


app = FastAPI(title="People API")


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


@app.delete("/people/{person_id}")
def delete_person(person_id: str):

    if not ObjectId.is_valid(person_id):
        raise HTTPException(status_code=400, detail="Invalid person ID")

    result = people_collection.delete_one({"_id": ObjectId(person_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Person not found")

    return {"message": "Person deleted successfully"}