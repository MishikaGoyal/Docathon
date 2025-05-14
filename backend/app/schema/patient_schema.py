from pydantic import BaseModel, EmailStr
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
    user_id: str  
    disease: DiseaseModel
    prescribed_drugs: List[DrugModel]


