"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { PatientData, PatientRecord } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, AlertCircle, CheckCircle } from "lucide-react";
import { AddMedicationButton } from './AddMedicationButton';

interface MedicalRecordsProps {
  patientData: PatientData;
  onAddNewDrug: () => void;
}

export default function MedicalRecords({ patientData, onAddNewDrug }: MedicalRecordsProps) {
  const [activeTab, setActiveTab] = useState('all');
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString.split('T')[0];
    }
  };

  // Filter records based on active tab
  const filteredRecords = patientData.records.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return record.disease.active_status;
    return !record.disease.active_status;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl">Medical Records</CardTitle>
            <CardDescription>
              Patient: {patientData.user_id}
            </CardDescription>
          </div>
          <AddMedicationButton onClick={onAddNewDrug} />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Diseases</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredRecords.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No records found in this category
              </div>
            ) : (
              filteredRecords.map((record, index) => (
                <DiseaseCard key={index} record={record} index={index} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function DiseaseCard({ record, index }: { record: PatientRecord; index: number }) {
  const [expanded, setExpanded] = useState(false);
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString.split('T')[0];
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className="bg-card pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl capitalize">
              {record.disease.disease_name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={record.disease.severity === "mild" ? "outline" : record.disease.severity === "moderate" ? "secondary" : "destructive"}>
                {record.disease.severity}
              </Badge>
              {record.disease.active_status ? (
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  <CheckCircle className="mr-1 h-3 w-3" /> Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">
                  Inactive
                </Badge>
              )}
              <span className="text-sm text-muted-foreground">
                Since {formatDate(record.disease.diagnosed_date)}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="text-primary"
          >
            {expanded ? 'Hide Medications' : 'Show Medications'}
          </Button>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="pt-4 pb-2">
          <h4 className="text-sm font-medium mb-2">Prescribed Medications ({record.prescribed_drugs.length})</h4>
          <div className="space-y-3">
            {record.prescribed_drugs.map((drug, drugIndex) => (
              <div key={drugIndex} className="bg-secondary/20 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{drug.drug_name}</div>
                  {drug.active_status ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="outline">Discontinued</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>{drug.doses}</span>
                  <span className="mx-2">•</span>
                  <span>Started on {formatDate(drug.start_date)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}