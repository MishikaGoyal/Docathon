export interface PatientData {
    _id: string;
    user_id: string;
    records: PatientRecord[];
  }
  
  export interface PatientRecord {
    disease: Disease;
    prescribed_drugs: Drug[];
  }
  
  export interface Disease {
    disease_name: string;
    severity: string;
    active_status: boolean;
    diagnosed_date: string;
  }
  
  export interface Drug {
    drug_name: string;
    doses: string;
    active_status: boolean;
    start_date: string;
  }
  
  export interface ApiResponse {
    patient_data: PatientData;
    message: string;
  }
  
  export interface AddDrugFormData {
    diseaseType: 'existing' | 'new';
    existingDiseaseIndex?: number;
    newDisease?: Disease;
    drugs: Drug[];
  }