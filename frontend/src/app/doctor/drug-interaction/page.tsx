"use client";

import { useState } from 'react';
import { fetchPatientData, addNewDrug } from '@/lib/drug-api';
import { AddDrugFormData, ApiResponse, PatientData } from '@/types';
import { Button } from '@/components/ui/button';
import PatientSearch from '@/components/doctor/drug-component/PatientSearch';
import MedicalRecords from '@/components/doctor/drug-component/MedicalRecord';
import AddMedicationForm from '@/components/doctor/drug-component/AddMedicationForm';
import NewPatientForm from '@/components/doctor/drug-component/NewPatientForm';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import axios from 'axios';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);

  const handleSearch = async (username: string) => {
    setIsLoading(true);
    try {
      //const response = await fetchPatientData(username);

      const response = await axios.post("http://localhost:8000/get-medical-records", {
        user_id: username
      })
      if (response) {
        setPatientData(response.data.patient_data);
        setApiResponse(response.data);
        toast.success(response.data.message);
      } else {
        toast.error(`No records found for ${username}`);
        setPatientData(null);
        setApiResponse(null);
      }
    } catch (error) {
      toast.error("Error fetching patient data");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewDrug = () => {
    setShowAddForm(true);
  };

  const handleCancelAddDrug = () => {
    setShowAddForm(false);
  };

  const handleSubmitAddDrug = async (formData: AddDrugFormData) => {
    if (!patientData) return;

    try {
      // In a real application, you would send this to your API
      //const success = await addNewDrug(patientData._id, formData);

      let apiData;

      if (formData.diseaseType === 'existing' && formData.existingDiseaseIndex !== undefined) {
        // Get the disease object from patient's records by index
        const existingDisease = patientData.records[formData.existingDiseaseIndex];

        apiData = {
          user_id: patientData.user_id,
          disease: {
            disease_name: existingDisease.disease.disease_name,
            severity: existingDisease.disease.severity,
            active_status: existingDisease.disease.active_status,
            diagnosed_date: existingDisease.disease.diagnosed_date
          },
          prescribed_drugs: formData.drugs,
        };
      } else if (formData.diseaseType === 'new' && formData.newDisease) {
        apiData = {
          user_id: patientData.user_id,
          disease: {
            disease_name: formData.newDisease.disease_name,
            severity: formData.newDisease.severity,
            active_status: formData.newDisease.active_status,
            diagnosed_date: formData.newDisease.diagnosed_date,
          },
          prescribed_drugs: formData.drugs,
        };
      } else {
        toast.error("Invalid form data");
        return;
      }


      const response = await axios.post("http://localhost:8000/doctor/add-medical-record", apiData);

      if (response.data?.status === "conflict") {
        const conflicts = response.data.conflicts;
        let conflictMessages = conflicts.map(
          (c: any) => `⚠️ Conflict between existing condition "${c.prev}" and new drug "${c.new}": ${c.remarks}`
        ).join("\n");

        toast.warning(conflictMessages, {
          duration: 4000,
          style: { whiteSpace: "pre-line", background: "#fff3cd", color: "#856404", border: "1px solid #ffeeba" },
        });

        // Do not close form or update patient data
        return;
      }

      if (response.data && response.status === 200) {
        // Update local state to simulate successful update

        const updatedPatientData = { ...patientData };

        if (formData.diseaseType === 'existing' && formData.existingDiseaseIndex !== undefined) {
          // Adding drugs to an existing disease
          const diseaseIndex = formData.existingDiseaseIndex;
          updatedPatientData.records[diseaseIndex].prescribed_drugs = [
            ...updatedPatientData.records[diseaseIndex].prescribed_drugs,
            ...formData.drugs
          ];
        } else if (formData.diseaseType === 'new' && formData.newDisease) {
          // Adding a new disease with drugs
          updatedPatientData.records.push({
            disease: formData.newDisease,
            prescribed_drugs: formData.drugs
          });
        }

        setPatientData(updatedPatientData);
        if (apiResponse) {
          setApiResponse({
            ...apiResponse,
            patient_data: updatedPatientData
          });
        }

        toast.success("Medication added successfully");
        setShowAddForm(false);
      } else {
        toast.error("Failed to add medication");
      }
    } catch (error) {
      toast.error("Error adding medication");
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Medical Records System</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
            Search for patients and manage their medical records, diseases, and medications
          </p>
        </div>

        {!patientData && !showAddForm && (
          <>
            <PatientSearch onSearch={handleSearch} isLoading={isLoading} />
            <div className="text-center mt-4">
              <Button onClick={() => setShowAddForm(true)}>Add New Patient</Button>
            </div>
          </>
        )}

        {showAddForm && !patientData && (
          <NewPatientForm onSuccess={() => setShowAddForm(false)} />
        )}

        {patientData && !showAddForm && (
          <MedicalRecords patientData={patientData} onAddNewDrug={handleAddNewDrug} />
        )}

        {patientData && showAddForm && (
          <AddMedicationForm
            patientData={patientData}
            onCancel={handleCancelAddDrug}
            onSubmit={handleSubmitAddDrug}
          />
        )}
      </div>
      <Toaster />
    </main>
  );
}