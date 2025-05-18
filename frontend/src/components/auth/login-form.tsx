"use client";

import { SetStateAction, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/auth/toggle-group";
import { UserRound, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginForm() {
  const router = useRouter();

  const [role, setRole] = useState("user");
  const [loading , setIsloading] = useState(false)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url =
      role === "professional"
        ? "http://localhost:8000/doctor/login"
        : "http://localhost:8000/patient/login";

    try {
      setIsloading(true)
      const response = await axios.post(url, {
        email,
        password,
      } , {
        withCredentials: true, // Required to accept cookies from backend
      }
      );
      console.log("Login successful:", response.data);

      if (response.data){
        setIsloading(false)
        if (role === "professional") {
          router.push("/doctor/dashboard");
        } else {
          router.push("/patient/dashboard");
        }
      }
      
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      throw new Error("Login failed", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-center block mb-2">Select your role</Label>
        <div className="flex justify-center ">
          <ToggleGroup
            type="single"
            value={role}
            onValueChange={(value: SetStateAction<string>) =>
              value && setRole(value)
            }
            className="justify-center"
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

      <form
        className="space-y-4"
        onSubmit={handlelogin}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <AnimatePresence mode="wait">
          {role === "professional" && (
            <motion.div
              key="professional-fields"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2 overflow-hidden"
            ></motion.div>
          )}
        </AnimatePresence>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "log in...": "log in"}
        </Button>
      </form>
    </div>
  );
}
