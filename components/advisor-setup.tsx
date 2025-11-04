"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";

export interface AdvisorInfo {
  name: string;
  phone: string;
  address: string;
}

interface AdvisorSetupProps {
  open: boolean;
  onClose: () => void;
  onSave: (info: AdvisorInfo) => void;
}

export const AdvisorSetup = ({ open, onClose, onSave }: AdvisorSetupProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof AdvisorInfo, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AdvisorInfo, string>> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    if (!address.trim()) {
      newErrors.address = "Address is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const advisorInfo: AdvisorInfo = {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };
      onSave(advisorInfo);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Advisor Setup</DialogTitle>
          </div>
          <DialogDescription>
            Please provide your information to personalize the presentation. This information will be used in the generated PDF reports.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Advisor Name *</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              placeholder="Enter your complete address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Get advisor info from localStorage
// Returns null if not set (setup not completed)
export const getAdvisorInfo = (): AdvisorInfo | null => {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem("advisorInfo");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

// Save advisor info to localStorage - single time setup
// Once saved, the setup dialog will not show again
export const saveAdvisorInfo = (info: AdvisorInfo): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("advisorInfo", JSON.stringify(info));
  localStorage.setItem("advisorSetupComplete", "true");
};

// Check if advisor setup is complete
// Returns true if setup was completed (stored in localStorage)
// This ensures the setup dialog only shows once
export const isSetupComplete = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("advisorSetupComplete") === "true";
};

