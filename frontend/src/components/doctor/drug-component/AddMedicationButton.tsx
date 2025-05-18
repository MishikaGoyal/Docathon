"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface AddMedicationButtonProps {
  onClick: () => void;
}

export function AddMedicationButton({ onClick }: AddMedicationButtonProps) {
  return (
    <Button onClick={onClick} className="bg-primary hover:bg-primary/90">
      <PlusCircle className="mr-2 h-4 w-4" />
      Add Medication
    </Button>
  );
}