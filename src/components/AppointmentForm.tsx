import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock, User, Phone, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const timeSlots = [
  "9:00 AM - 9:30 AM",
  "10:00 AM - 10:30 AM",
  "11:00 AM - 11:30 AM",
  "12:00 PM - 12:30 PM",
  "2:00 PM - 2:30 PM",
  "3:00 PM - 3:30 PM",
  "4:00 PM - 4:30 PM",
];

interface FormData {
  fullName: string;
  mobileNumber: string;
  email: string;
  appointmentDate: Date | undefined;
  timeSlot: string;
}

interface SubmissionStatus {
  status: "success" | "conflict" | "error";
  message: string;
  appointment_id?: string;
  date?: string;
  slot?: string;
  suggested_slots?: string[];
}

export function AppointmentForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    mobileNumber: "",
    email: "",
    appointmentDate: undefined,
    timeSlot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus(null);

    const payload = {
      name: formData.fullName.trim(),
      phone: formData.mobileNumber.trim(),
      email: formData.email.trim(),
      date: formData.appointmentDate ? format(formData.appointmentDate, "yyyy-MM-dd") : "",
      slot: formData.timeSlot,
    };

    try {
      const response = await fetch("https://yg2708.app.n8n.cloud/webhook-test/01841bd3-49c0-4929-bb70-86683d5b7d79", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      
      // Try to parse as JSON first, fall back to text handling
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        // If it's plain text, treat as success if response was OK
        if (response.ok) {
          setSubmissionStatus({
            status: "success",
            message: text || "Your appointment has been booked successfully.",
          });
          setFormData({
            fullName: "",
            mobileNumber: "",
            email: "",
            appointmentDate: undefined,
            timeSlot: "",
          });
        } else {
          setSubmissionStatus({
            status: "error",
            message: text || "Unable to process your request. Please try again.",
          });
        }
        return;
      }

      if (data.status === "success") {
        setSubmissionStatus({
          status: "success",
          message: data.message,
          appointment_id: data.appointment_id,
          date: data.date,
          slot: data.slot,
        });
        setFormData({
          fullName: "",
          mobileNumber: "",
          email: "",
          appointmentDate: undefined,
          timeSlot: "",
        });
      } else if (data.status === "conflict") {
        setSubmissionStatus({
          status: "conflict",
          message: data.message,
          suggested_slots: data.suggested_slots,
        });
      } else {
        setSubmissionStatus({
          status: "error",
          message: data.message || "Unable to process your request. Please try again.",
        });
      }
    } catch (error) {
      setSubmissionStatus({
        status: "error",
        message: "Unable to connect to the server. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = 
    formData.fullName.trim() !== "" &&
    formData.mobileNumber.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.appointmentDate !== undefined &&
    formData.timeSlot !== "";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
          Full Name
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Mobile Number */}
      <div className="space-y-2">
        <Label htmlFor="mobileNumber" className="text-sm font-medium text-foreground">
          Mobile Number
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="mobileNumber"
            type="tel"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-foreground">
          Email Address
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Appointment Date */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Preferred Appointment Date
        </Label>
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.appointmentDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.appointmentDate ? (
                format(formData.appointmentDate, "PPP")
              ) : (
                <span>Select a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={formData.appointmentDate}
              onSelect={(date) => {
                setFormData({ ...formData, appointmentDate: date });
                setCalendarOpen(false);
              }}
              disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Slot */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-foreground">
          Preferred Time Slot
        </Label>
        <Select
          value={formData.timeSlot}
          onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
        >
          <SelectTrigger className="w-full">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select a time slot" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Clinic Hours: 9:00 AM – 1:00 PM & 2:00 PM – 5:00 PM
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? "Booking..." : "Book Appointment"}
      </Button>

      {/* Status Message */}
      {submissionStatus && (
        <div
          className={cn(
            "flex flex-col gap-3 p-4 rounded-lg",
            submissionStatus.status === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : submissionStatus.status === "conflict"
              ? "bg-amber-50 text-amber-800 border border-amber-200"
              : "bg-red-50 text-red-800 border border-red-200"
          )}
        >
          <div className="flex items-start gap-3">
            {submissionStatus.status === "success" ? (
              <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium">{submissionStatus.message}</p>
              {submissionStatus.status === "success" && submissionStatus.appointment_id && (
                <div className="mt-2 text-sm space-y-1">
                  <p><span className="font-medium">Appointment ID:</span> {submissionStatus.appointment_id}</p>
                  <p><span className="font-medium">Date:</span> {submissionStatus.date}</p>
                  <p><span className="font-medium">Time:</span> {submissionStatus.slot}</p>
                </div>
              )}
              {submissionStatus.status === "conflict" && submissionStatus.suggested_slots && submissionStatus.suggested_slots.length > 0 && (
                <div className="mt-2 text-sm">
                  <p className="font-medium">Available slots:</p>
                  <ul className="mt-1 list-disc list-inside">
                    {submissionStatus.suggested_slots.map((slot) => (
                      <li key={slot}>{slot}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
