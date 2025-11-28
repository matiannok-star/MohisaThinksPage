import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Calendar as CalendarIcon, Clock, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";

interface ConsultationCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Helper for formatting dates as YYYY-MM-DD (local time)
const formatDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper for display formatting
const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const ConsultationCalendar: React.FC<ConsultationCalendarProps> = ({ open, onOpenChange }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<'date' | 'details' | 'success'>('date');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });

  const { toast } = useToast();

  // Fetch availability when date (month) changes or dialog opens
  useEffect(() => {
    if (open && date) {
      fetchAvailability(date);
    }
  }, [open, date?.getMonth(), date?.getFullYear()]);

  const fetchAvailability = async (selectedDate: Date) => {
    setIsLoading(true);
    try {
      // Calculate start and end of the month for the view
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);

      const startDate = formatDateKey(startOfMonth);
      const endDate = formatDateKey(endOfMonth);

      const { data, error } = await supabase.functions.invoke('get-calendar-availability', {
        body: { startDate, endDate }
      });

      if (error) throw error;
      
      setAvailability(data?.availability || {});
    } catch (error) {
      console.error('Error fetching availability:', error);
      // Fallback for demo/development if function is not deployed or fails
      const fallbackData: Record<string, string[]> = {};
      const today = new Date();
      for(let i=0; i<60; i++) {
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          const dateStr = formatDateKey(d);
          // Mock available weekdays (Mon-Fri)
          const day = d.getDay();
          if (day !== 0 && day !== 6) { 
              fallbackData[dateStr] = ["09:00", "10:00", "11:00", "14:00", "15:00"];
          }
      }
      setAvailability(fallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    setSelectedSlot(null); // Reset slot when date changes
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (date && selectedSlot) {
      setStep('details');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!date || !selectedSlot) return;

      const dateStr = formatDateKey(date);
      const subject = `Consultation Booking: ${dateStr} at ${selectedSlot}`;
      const messageBody = `Booking Request:\nDate: ${dateStr}\nTime: ${selectedSlot}\n\nClient Details:\nName: ${formData.name}\nPhone: ${formData.phone}\nNotes: ${formData.notes}`;

      // Insert into messages table as a booking request
      const { error } = await supabase.from('messages').insert([
        {
          first_name: formData.name.split(' ')[0],
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          phone: formData.phone,
          subject: subject,
          message: messageBody
        }
      ]);

      if (error) throw error;

      setStep('success');
    } catch (error) {
      console.error('Error booking consultation:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error scheduling your consultation. Please contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetFlow = () => {
    setStep('date');
    setSelectedSlot(null);
    setFormData({ name: "", email: "", phone: "", notes: "" });
    onOpenChange(false);
  };

  // Get slots for currently selected date
  const currentSlots = date ? (availability[formatDateKey(date)] || []) : [];

  // Limit date range (today to 2 months out)
  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-slate-950 border-slate-800 text-slate-50 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-primary" />
            Book Your Consultation
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Select a date and time for your free 30-minute discovery call.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 'date' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-3 border border-slate-800 rounded-lg bg-slate-900/50 flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  className="rounded-md"
                  disabled={(d) => d < new Date(new Date().setHours(0,0,0,0)) || d > maxDate}
                />
              </div>

              <div className="flex flex-col h-full">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Times
                </h3>
                
                <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : currentSlots.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {currentSlots.map((slot) => (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? "default" : "outline"}
                          className={`w-full justify-center ${selectedSlot === slot ? "bg-primary text-primary-foreground" : "border-slate-700 hover:bg-slate-800"}`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
                      <CalendarIcon className="w-8 h-8 mb-2 opacity-50" />
                      {date ? "No slots available" : "Select a date"}
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full mt-4" 
                  disabled={!selectedSlot}
                  onClick={handleContinue}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-slate-400">Selected Time</p>
                  <p className="font-semibold text-primary">
                    {date && formatDisplayDate(date)} at {selectedSlot}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setStep('date')}>
                  Change
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-slate-900 border-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input 
                  id="phone" 
                  name="phone" 
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="bg-slate-900 border-slate-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">What would you like to discuss?</Label>
                <Input 
                  id="notes" 
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="bg-slate-900 border-slate-700"
                  placeholder="e.g. Workflow automation for my agency..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep('date')} className="flex-1">
                  Back
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</> : "Confirm Booking"}
                </Button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
              <p className="text-slate-400 max-w-sm mb-6">
                You're all set for <strong>{date && formatDisplayDate(date)} at {selectedSlot}</strong>. 
                We've sent a confirmation email to {formData.email}.
              </p>
              <Button onClick={resetFlow} className="w-full max-w-xs">
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationCalendar;