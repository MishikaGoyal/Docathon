import { ApiResponse } from '@/types';

// Mock API service
export async function fetchPatientData(username: string): Promise<ApiResponse | null> {
  try {
    // In a real application, this would be an actual API call
    // For demo purposes, we're returning mock data after a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data based on the provided structure
    if (username.toLowerCase() === 'kalu@example.com') {
      return {
        patient_data: {
          _id: "68248ca48dfff04ae345eed7",
          user_id: "kalu@example.com",
          records: [
            {
              disease: {
                disease_name: "Tuberculosis",
                severity: "mild",
                active_status: true,
                diagnosed_date: "2025-05-14T00:00:00"
              },
              prescribed_drugs: [
                {
                  drug_name: "Paracetamol",
                  doses: "3 times per day",
                  active_status: true,
                  start_date: "2025-05-14T00:00:00"
                },
                {
                  drug_name: "Azithromycin",
                  doses: "3 times per day",
                  active_status: true,
                  start_date: "2025-05-14T00:00:00"
                }
              ]
            },
            {
              disease: {
                disease_name: "Cancer",
                severity: "mild",
                active_status: true,
                diagnosed_date: "2025-05-14T00:00:00"
              },
              prescribed_drugs: [
                {
                  drug_name: "Namkeen",
                  doses: "3 times per day",
                  active_status: true,
                  start_date: "2025-05-14T00:00:00"
                }
              ]
            }
          ]
        },
        message: "Found medical record for patient kalu@example.com"
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return null;
  }
}

export async function addNewDrug(patientId: string, data: any): Promise<boolean> {
  try {
    // In a real application, this would be an actual API call
    // For demo purposes, we're just returning success after a delay
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("New drug added:", { patientId, data });
    return true;
  } catch (error) {
    console.error("Error adding new drug:", error);
    return false;
  }
}