"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

export default function NewPatientForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState({
    user_id: "",
    disease_name: "",
    severity: "",
    disease_active_status: "active", // string for UI, convert to boolean later
    diagnosed_date: "",
    prescribed_drugs: [
      {
        drug_name: "",
        doses: "",
        active_status: "active",
        start_date: "",
      },
    ],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number,
    field?: keyof (typeof form.prescribed_drugs)[number]
  ) => {
    const { name, value } = e.target;

    if (typeof index === "number" && field) {
      const newDrugs = [...form.prescribed_drugs];
      newDrugs[index][field] = value;
      setForm((prev) => ({
        ...prev,
        prescribed_drugs: newDrugs,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addDrugField = () => {
    setForm((prev) => ({
      ...prev,
      prescribed_drugs: [
        ...prev.prescribed_drugs,
        {
          drug_name: "",
          doses: "",
          active_status: "active",
          start_date: "",
        },
      ],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    
    const payload = {
      user_id: form.user_id,
      disease: {
        disease_name: form.disease_name,
        severity: form.severity,
        active_status: form.disease_active_status === "active",
        diagnosed_date: new Date(form.diagnosed_date).toISOString(),
      },
      prescribed_drugs: form.prescribed_drugs.map((drug) => ({
        drug_name: drug.drug_name,
        doses: drug.doses,
        active_status: drug.active_status === "active",
        start_date: new Date(drug.start_date).toISOString(),
      })),
    };

    console.log("The payload is",payload)

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/doctor/add-medical-record",
        payload
      );

      console.log("the reponse data is ", res.data)
      if (res.data?.status === "conflict") {
        const message = res.data.conflicts
          .map(
            (c: any) =>
              `⚠️ Conflict between "${c.prev}" and "${c.new}": ${c.remarks}`
          )
          .join("\n");
        toast.warning(message, { style: { whiteSpace: "pre-line" } });
        return;
      }

      if (res.status === 200) {
        toast.success("Patient record added successfully");
        // Reset form
        setForm({
          user_id: "",
          disease_name: "",
          severity: "",
          disease_active_status: "active",
          diagnosed_date: "",
          prescribed_drugs: [
            {
              drug_name: "",
              doses: "",
              active_status: "active",
              start_date: "",
            },
          ],
        });
        onSuccess?.();
      } else {
        toast.error("Failed to add patient record");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Add New Patient Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="user_id"
            placeholder="Patient ID / Email"
            value={form.user_id}
            onChange={handleChange}
            required
          />
          <Input
            name="disease_name"
            placeholder="Disease Name"
            value={form.disease_name}
            onChange={handleChange}
            required
          />
          <Input
            name="severity"
            placeholder="Severity (e.g., mild, moderate, severe)"
            value={form.severity}
            onChange={handleChange}
            required
          />
          <select
            name="disease_active_status"
            value={form.disease_active_status}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <Input
            type="date"
            name="diagnosed_date"
            value={form.diagnosed_date}
            onChange={handleChange}
            required
          />

          <div className="space-y-4">
            <label className="block font-semibold text-lg">Prescribed Drugs</label>
            {form.prescribed_drugs.map((drug, index) => (
              <div
                key={index}
                className="space-y-2 border border-gray-300 p-4 rounded"
              >
                <Input
                  placeholder="Drug Name"
                  value={drug.drug_name}
                  onChange={(e) => handleChange(e, index, "drug_name")}
                  required
                />
                <Input
                  placeholder="Doses (e.g., 1 tablet/day)"
                  value={drug.doses}
                  onChange={(e) => handleChange(e, index, "doses")}
                  required
                />
                <select
                  value={drug.active_status}
                  onChange={(e) => handleChange(e, index, "active_status")}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Input
                  type="date"
                  value={drug.start_date}
                  onChange={(e) => handleChange(e, index, "start_date")}
                  required
                />
              </div>
            ))}
            <Button
              type="button"
              variant="secondary"
              onClick={addDrugField}
              className="mt-2"
            >
              + Add Another Drug
            </Button>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Add Patient Record"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
