import { AppointmentForm } from "@/components/AppointmentForm";
import { Stethoscope, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Stethoscope className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Dr. Stephen Strange
              </h1>
              <p className="text-sm text-muted-foreground">Physiotherapy Clinic</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Form Card */}
          <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Book an Appointment
              </h2>
              <p className="text-sm text-muted-foreground">
                Fill in your details below and we'll confirm your appointment shortly.
              </p>
            </div>

            <AppointmentForm />
          </div>

          {/* Clinic Hours Info */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Clinic Hours: Monday – Saturday, 9:00 AM – 5:00 PM</p>
            <p className="mt-1">Closed on Sundays</p>
          </div>

          {/* Telegram Button */}
          <div className="mt-6 flex justify-center">
            <Button
              asChild
              variant="outline"
              className="gap-2 bg-[#0088cc] hover:bg-[#0077b5] text-white hover:text-white border-none"
            >
              <a
                href="https://t.me/YOUR_TELEGRAM_BOT"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4" />
                Chat on Telegram
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
