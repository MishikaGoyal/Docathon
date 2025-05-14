from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from app.database import db
from datetime import datetime
from typing import List

class DiseaseModel(BaseModel):
    disease_name: str
    severity: str
    active_status: bool
    diagnosed_date: datetime

class DrugModel(BaseModel):
    drug_name: str
    doses: str
    active_status: bool
    start_date: datetime

class MedicalRecord(BaseModel):
    user_id: str  # This should actually be patient_id (ObjectId in str)
    disease: DiseaseModel
    prescribed_drugs: List[DrugModel]

class PatientMedicalRecord(BaseModel):
    user_id: str


drugs_router = APIRouter()


@drugs_router.post("/doctor/add-medical-record")
async def add_medical_record(new_record: MedicalRecord):
    user_id = new_record.user_id
    disease_name = new_record.disease.disease_name.lower()

    # STEP 1: Check if patient exists
    patient = await db["patients"].find_one({"email": user_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # STEP 2: Check if user already has a medical record
    existing_record = await db["medical_records"].find_one({"user_id": user_id})

    if not existing_record:
        # First-time: create new medical record
        new_entry = {
            "user_id": user_id,
            "records": [
                {
                    "disease": new_record.disease.model_dump(),
                    "prescribed_drugs": [drug.model_dump() for drug in new_record.prescribed_drugs]
                }
            ]
        }
        await db["medical_records"].insert_one(new_entry)
        return {"status": "added", "message": "New patient medical record created"}

    # STEP 3: Check if disease already exists
    for idx, record in enumerate(existing_record["records"]):
        if record["disease"]["disease_name"].lower() == disease_name:
            # Append new drugs to existing disease
            await db["medical_records"].update_one(
                {"_id": existing_record["_id"]},
                {
                    "$push": {
                        f"records.{idx}.prescribed_drugs": {
                            "$each": [drug.model_dump() for drug in new_record.prescribed_drugs]
                        }
                    }
                }
            )
            return {
                "status": "updated",
                "message": f"Added drugs to existing disease '{disease_name}'"
            }

    # STEP 4: New disease — append to records array
    new_disease_record = {
        "disease": new_record.disease.model_dump(),
        "prescribed_drugs": [drug.model_dump() for drug in new_record.prescribed_drugs]
    }

    await db["medical_records"].update_one(
        {"_id": existing_record["_id"]},
        {"$push": {"records": new_disease_record}}
    )
    return {
        "status": "created",
        "message": f"New disease '{disease_name}' added for existing patient"
    }


@drugs_router.get("/get-medical-records")
async def get_medic_records(record_userid: PatientMedicalRecord):
    records = await db["medical_records"].find_one({"user_id": record_userid.user_id})

    if not records:
        raise HTTPException(status_code=404, detail="Medical records not found")

    return {
        "patient_data": records,
        "message": f"Found medical record for patient '{record_userid.user_id}'"
    }
