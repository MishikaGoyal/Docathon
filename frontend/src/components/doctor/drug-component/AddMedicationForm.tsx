"use client";

import { useState } from "react";
import { AddDrugFormData, Disease, Drug, PatientData } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DiseaseForm } from "./DiseaseForm";
import { DrugForm } from "./DrugForm";
import { PlusCircle, ArrowLeft, Loader2 } from "lucide-react";

interface AddMedicationFormProps {
  patientData: PatientData;
  onCancel: () => void;
  onSubmit: (formData: AddDrugFormData) => Promise<void>;
}

export default function AddMedicationForm({ patientData, onCancel, onSubmit }: AddMedicationFormProps) {
  const [diseaseType, setDiseaseType] = useState<'existing' | 'new'>('existing');
  const [existingDiseaseIndex, setExistingDiseaseIndex] = useState<number>(0);
  const [newDisease, setNewDisease] = useState<Disease>({
    disease_name: "",
    severity: "",
    active_status: true,
    diagnosed_date: new Date().toISOString()
  });
  const [drugs, setDrugs] = useState<Drug[]>([{
    drug_name: "",
    doses: "",
    active_status: true,
    start_date: new Date().toISOString()
  }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDrug = () => {
    setDrugs([
      ...drugs,
      {
        drug_name: "",
        doses: "",
        active_status: true,
        start_date: new Date().toISOString()
      }
    ]);
  };

  const handleDrugChange = (index: number, updatedDrug: Drug) => {
    const updatedDrugs = [...drugs];
    updatedDrugs[index] = updatedDrug;
    setDrugs(updatedDrugs);
  };

  const handleRemoveDrug = (index: number) => {
    setDrugs(drugs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData: AddDrugFormData = {
        diseaseType,
        drugs
      };
      
      if (diseaseType === 'existing') {
        formData.existingDiseaseIndex = existingDiseaseIndex;
      } else {
        formData.newDisease = newDisease;
      }
      
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const drugsValid = drugs.every(drug => 
      drug.drug_name.trim() !== '' && 
      drug.doses.trim() !== '' && 
      drug.start_date
    );
    
    if (diseaseType === 'new') {
      return drugsValid && 
        newDisease.disease_name.trim() !== '' && 
        newDisease.diagnosed_date;
    }
    
    return drugsValid;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>Add New Medication</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-lg font-medium">Select Disease Type</h3>
          <RadioGroup
            value={diseaseType}
            onValueChange={(value) => setDiseaseType(value as 'existing' | 'new')}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="existing" id="existing" />
              <Label htmlFor="existing">Existing Disease</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">New Disease</Label>
            </div>
          </RadioGroup>
        </div>

        {diseaseType === 'existing' && patientData.records.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Select Disease</h3>
            <Select
              value={existingDiseaseIndex.toString()}
              onValueChange={(value) => setExistingDiseaseIndex(parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a disease" />
              </SelectTrigger>
              <SelectContent>
                {patientData.records.map((record, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {record.disease.disease_name} 
                    {!record.disease.active_status && " (Inactive)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {diseaseType === 'new' && (
          <div className="space-y-3">
            <h3 className="text-lg font-medium">New Disease Information</h3>
            <DiseaseForm disease={newDisease} onChange={setNewDisease} />
          </div>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Medications</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddDrug}
              className="text-primary"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Another Medication
            </Button>
          </div>

          <div className="space-y-4">
            {drugs.map((drug, index) => (
              <DrugForm
                key={index}
                index={index}
                drug={drug}
                onChange={handleDrugChange}
                onRemove={handleRemoveDrug}
                canRemove={drugs.length > 1}
              />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={!isFormValid() || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}