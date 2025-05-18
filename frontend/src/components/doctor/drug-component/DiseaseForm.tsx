"use client";

import { useState } from "react";
import { Disease } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DiseaseFormProps {
  disease: Disease;
  onChange: (disease: Disease) => void;
}

export function DiseaseForm({ disease, onChange }: DiseaseFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    disease.diagnosed_date ? new Date(disease.diagnosed_date) : undefined
  );

  const handleDateSelect = (date: Date | undefined) => {
    setDate(date);
    if (date) {
      const isoDate = date.toISOString();
      onChange({ ...disease, diagnosed_date: isoDate });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="disease-name">Disease Name</Label>
        <Input
          id="disease-name"
          value={disease.disease_name}
          onChange={(e) => onChange({ ...disease, disease_name: e.target.value })}
          placeholder="Enter disease name"
        />
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="severity">Severity</Label>
        <Select
          value={disease.severity}
          onValueChange={(value) => onChange({ ...disease, severity: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mild">Mild</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="severe">Severe</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="active-status"
          checked={disease.active_status}
          onCheckedChange={(checked) => onChange({ ...disease, active_status: checked })}
        />
        <Label htmlFor="active-status">Active Status</Label>
      </div>
      
      <div className="grid gap-2">
        <Label>Diagnosed Date</Label>
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
  );
}