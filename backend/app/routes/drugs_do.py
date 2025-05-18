from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database import db
from datetime import datetime
from typing import List
from app.utils import drug_checker
from bson import ObjectId

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
    user_id: str
    disease: DiseaseModel
    prescribed_drugs: List[DrugModel]

class PatientMedicalRecord(BaseModel):
    user_id: str

drugs_router = APIRouter()

def convert_object_ids(document):
    """Recursively convert ObjectIds in a MongoDB document to strings."""
    if isinstance(document, dict):
        return {k: convert_object_ids(v) for k, v in document.items()}
    elif isinstance(document, list):
        return [convert_object_ids(item) for item in document]
    elif isinstance(document, ObjectId):
        return str(document)
    else:
        return document

@drugs_router.post("/doctor/add-medical-record")
async def add_medical_record(new_record: MedicalRecord):
    print("new record recienved is", new_record)
    user_id = new_record.user_id
    disease_key = new_record.disease.disease_name.lower()

    patient = await db["patients"].find_one({"email": user_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    existing = await db["medical_records"].find_one({"user_id": user_id})
    if not existing:
        await db["medical_records"].insert_one({
            "user_id": user_id,
            "records": [
                {
                    "disease": new_record.disease.model_dump(),
                    "prescribed_drugs": [d.model_dump() for d in new_record.prescribed_drugs]
                }
            ]
        })
        return {"status": "added", "message": "New medical record created"}

    prev_drugs = [
        d["drug_name"]
        for rec in existing["records"]
        for d in rec.get("prescribed_drugs", [])
        if d.get("active_status")
    ]
    new_drugs = [d.drug_name for d in new_record.prescribed_drugs]

    results = drug_checker.check_interactions(prev_drugs, new_drugs)
    conflicts = [r for r in results if r["conflict"] == "True"]
    if conflicts:
        return {
            "status": "conflict",
            "conflicts": conflicts
        }

    #. Check if the disease exists in record
    for idx, rec in enumerate(existing["records"]):
        if rec["disease"]["disease_name"].lower() == disease_key:
            # Check for duplicate drug names (active)
            existing_drug_names = {
                d["drug_name"].strip().lower(): d["active_status"]
                for d in rec.get("prescribed_drugs", [])
            }

            for new_drug in new_record.prescribed_drugs:
                name = new_drug.drug_name.strip().lower()
                if name in existing_drug_names:
                    if existing_drug_names[name]:
                        return {
                            "status": "exists",
                            "message": f"Drug '{new_drug.drug_name}' is already prescribed and active for '{disease_key}'"
                        }

            # No duplicates → safe to append
            await db["medical_records"].update_one(
                {"_id": existing["_id"]},
                {
                    "$push": {
                        f"records.{idx}.prescribed_drugs": {
                            "$each": [d.model_dump() for d in new_record.prescribed_drugs]
                        }
                    }
                }
            )
            return {
                "status": "updated",
                "message": f"Added drugs to existing disease '{disease_key}'"
            }

    # . If disease does not exist, add it
    new_rec = {
        "disease": new_record.disease.model_dump(),
        "prescribed_drugs": [d.model_dump() for d in new_record.prescribed_drugs]
    }
    await db["medical_records"].update_one(
        {"_id": existing["_id"]},
        {"$push": {"records": new_rec}}
    )
    return {
        "status": "created",
        "message": f"New disease '{disease_key}' added"
    }


@drugs_router.post("/get-medical-records")
async def get_medic_records(patient: PatientMedicalRecord):
    record_userid = patient.user_id
    records = await db["medical_records"].find_one({"user_id": record_userid})

    if not records:
        raise HTTPException(status_code=404, detail="Medical records not found")

    converted_record = convert_object_ids(records)

    return {
        "patient_data": converted_record,
        "message": f"Found medical record for patient {record_userid}"
    }

