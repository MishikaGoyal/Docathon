"use client";

import { SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { UserRound, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterForm() {
  const [role, setRole] = useState("user");

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div className="text-center space-y-2">
        <Label className="block">Select your role</Label>
        <div className="flex justify-center">
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={(value: SetStateAction<string>) =>
              value && setRole(value)
            }
          >
            <ToggleGroupItem
              value="user"
              aria-label="User"
              className="flex flex-col items-center gap-1 px-6 py-2"
            >
              <UserRound className="h-5 w-5" />
              <span className="text-xs">Patient</span>
            </ToggleGroupItem>
            <ToggleGroupItem
              value="professional"
              aria-label="Professional"
              className="flex flex-col items-center gap-1 px-6 py-2"
            >
              <Briefcase className="h-5 w-5" />
              <span className="text-xs">Doctor</span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {/* Main Form */}
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Name</Label>
            <Input id="firstName" placeholder="John" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type="password" required />
        </div>

        <AnimatePresence mode="wait">
          {role === "user" && (
            <motion.div
              key="user-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              {/* Add any user-specific fields here if needed */}
            </motion.div>
          )}

          {role === "professional" && (
            <motion.div
              key="professional-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <div className="space-y-2">
                <Label htmlFor="specialty">Specialty</Label>
                <Select>
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
            </motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    </div>
  );
}
