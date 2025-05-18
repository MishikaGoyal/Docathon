"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/auth/toggle-group";
import { UserRound, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter()
  const [role, setRole] = useState("user");
  const  [loading , setIsloading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    dob: "",
    speciality: "",
    department: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelectChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
  
    const apiUrl =
      role === "user"
        ? "http://localhost:8000/patient/register"
        : "http://localhost:8000/doctor/register";
  
    const payload =
      role === "user"
        ? {
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            password: formData.password,
            dob: new Date(formData.dob).toISOString(),
          }
        : {
            name: formData.name,
            email: formData.email,
            gender: formData.gender,
            password: formData.password,
            speciality: formData.speciality,
            department: formData.department,
          };
  
    try {
      setIsloading(true)
      const response = await axios.post(apiUrl, payload, {
        withCredentials: true, 
        headers: {
          "Content-Type": "application/json",
        },
      });

      if(response.data){
        if (role == "user"){
          setIsloading(false)
          router.push("/patient/dashboard")
        }else {
          setIsloading(false)
          router.push("/doctor/dashboard")
        }
      }
  
    } catch (error: any) {
      const errMsg =
        error.response?.data?.detail || error.message || "Registration failed";
      alert(errMsg);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Label className="block">Select your role</Label>
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={(value) => value && setRole(value)}
          >
            <ToggleGroupItem value="user" aria-label="User">
              <UserRound className="h-5 w-5" />
              <span className="text-xs">Patient</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="professional" aria-label="Professional">
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Doctor</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Common Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select onValueChange={(val) => handleSelectChange("gender", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />
        </div>

        <AnimatePresence mode="wait">
          {role === "user" && (
            <motion.div
              key="patient-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" value={formData.dob} onChange={handleChange} required />
              </div>
            </motion.div>
          )}

          {role === "professional" && (
            <motion.div
              key="doctor-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden space-y-4"
            >
              <div>
                <Label htmlFor="speciality">Speciality</Label>
                <Select onValueChange={(val) => handleSelectChange("speciality", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neurology">Neurology</SelectItem>
                    <SelectItem value="cardiology">Cardiology</SelectItem>
                    <SelectItem value="orthopaedic">Orthopaedic</SelectItem>
                    <SelectItem value="ent">ENT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={formData.department} onChange={handleChange} required />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
