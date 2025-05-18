"use client";

import { useState } from "react";
import { Drug } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon, Trash2 } from "lucide-react";

interface DrugFormProps {
  index: number;
  drug: Drug;
  onChange: (index: number, drug: Drug) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

export function DrugForm({ index, drug, onChange, onRemove, canRemove }: DrugFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    drug.start_date ? new Date(drug.start_date) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      const isoDate = date.toISOString();
      onChange(index, { ...drug, start_date: isoDate });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">Medication #{index + 1}</h4>
        {canRemove && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onRemove(index)}
            className="h-8 w-8 text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor={`drug-name-${index}`}>Drug Name</Label>
          <Input
            id={`drug-name-${index}`}
            value={drug.drug_name}
            onChange={(e) => onChange(index, { ...drug, drug_name: e.target.value })}
            placeholder="Enter drug name"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor={`doses-${index}`}>Doses</Label>
          <Input
            id={`doses-${index}`}
            value={drug.doses}
            onChange={(e) => onChange(index, { ...drug, doses: e.target.value })}
            placeholder="E.g., 3 times per day"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id={`active-status-${index}`}
            checked={drug.active_status}
            onCheckedChange={(checked) => onChange(index, { ...drug, active_status: checked })}
          />
          <Label htmlFor={`active-status-${index}`}>Active Status</Label>
        </div>
        
        <div className="grid gap-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={`w-full justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}