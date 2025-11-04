"use client";

import { useState } from "react";
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
import { User, Target } from "lucide-react";

export interface ClientInfo {
  name: string;
  phone: string;
  email: string;
  address?: string;
  goals?: string[];
}

const CLIENT_GOALS = [
  "Retirement Planning",
  "Children's Education",
  "House Purchase",
  "Wealth Creation",
  "Tax Saving",
  "Emergency Fund",
  "Marriage Planning",
  "Vacation/Travel",
  "Business Investment",
  "Other",
];

interface ClientInfoDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (info: ClientInfo) => void;
}

export const ClientInfoDialog = ({
  open,
  onClose,
  onSave,
}: ClientInfoDialogProps) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ClientInfo, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ClientInfo, string>> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      const clientInfo: ClientInfo = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim() || undefined,
        goals: selectedGoals.length > 0 ? selectedGoals : undefined,
      };
      onSave(clientInfo);
      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setSelectedGoals([]);
      setErrors({});
    }
  };

  const handleCancel = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setSelectedGoals([]);
    setErrors({});
    onClose();
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleCancel()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle>Client Information</DialogTitle>
          </div>
          <DialogDescription>
            Please provide client information to personalize the PDF report.
            This information will be included in the generated document.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              placeholder="Enter client full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-phone">Phone Number *</Label>
            <Input
              id="client-phone"
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
            <Label htmlFor="client-email">Email Address *</Label>
            <Input
              id="client-email"
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-address">Address (Optional)</Label>
            <Input
              id="client-address"
              placeholder="Enter client address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-goals">Investment Goals (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {CLIENT_GOALS.map((goal) => (
                <label
                  key={goal}
                  className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer transition-colors ${
                    selectedGoals.includes(goal)
                      ? "bg-blue-50 border-blue-500"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal)}
                    onChange={() => toggleGoal(goal)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{goal}</span>
                </label>
              ))}
            </div>
            {selectedGoals.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {selectedGoals.join(", ")}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Generate PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

