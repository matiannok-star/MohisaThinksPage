import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConsultationCalendarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConsultationCalendar = ({ open, onOpenChange }: ConsultationCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  
  // Form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+1",
    mobile: "",
    message: "",
  });

  // Fetch availability from edge function
  useEffect(() => {
    if (!open) return;
    
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        // Fetch availability for next 15 days starting from today (in Qatar timezone UTC+3)
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 15);
        
        const startDate = today.toISOString();
        const endDateStr = endDate.toISOString();
        
        console.log('Fetching availability from:', startDate, 'to:', endDateStr);
        
        const { data, error } = await supabase.functions.invoke('get-calendar-availability', {
          body: { startDate, endDate: endDateStr }
        });

        if (error) {
          console.error('Edge function error:', error);
          throw error;
        }

        console.log('Received availability data:', data);
        
        // Use the availability data from the edge function
        if (data && data.availability) {
          setAvailability(data.availability);
          console.log('Availability set successfully. Days with slots:', Object.keys(data.availability).length);
        } else {
          console.warn('No availability data received');
          setAvailability({});
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        // Use empty availability on error
        setAvailability({});
        toast({
          title: "Calendar Error",
          description: "Unable to load calendar availability. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [open, toast]);

  // Get today in Qatar timezone (UTC+3)
  const getQatarToday = () => {
    const now = new Date();
    const qatarTime = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    return new Date(qatarTime.getUTCFullYear(), qatarTime.getUTCMonth(), qatarTime.getUTCDate());
  };
  
  const today = getQatarToday();
  
  // Calculate the selectable date range: next 7 days starting from tomorrow
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  const selectableEndDate = new Date(tomorrow);
  selectableEndDate.setDate(tomorrow.getDate() + 6); // 7 days total (tomorrow + 6 more)
  
  // Get all days in the current month for display
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };
  
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();
  
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const previousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    // Don't go before current month
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentDate(newDate);
    }
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    // Allow navigation but limit selection
    setCurrentDate(newDate);
  };

  // Check if a date is within the selectable range (tomorrow + 7 days)
  const isInSelectableRange = (date: Date) => {
    return date >= tomorrow && date <= selectableEndDate;
  };
  
  const isAvailable = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Only check availability if within selectable range
    if (!isInSelectableRange(date)) {
      return false;
    }
    
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availability[dateString] && availability[dateString].length > 0;
  };

  const getTimeSlots = (day: number) => {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return availability[dateString] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDay || !selectedTime) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your appointment.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const selectedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      
      const { error } = await supabase.from('appointments').insert({
        name: formData.name,
        email: formData.email,
        country_code: formData.countryCode,
        mobile: formData.mobile,
        message: formData.message,
        selected_date: selectedDate,
        selected_time: selectedTime,
      });

      if (error) throw error;

      toast({
        title: "Appointment Booked!",
        description: "Your consultation has been scheduled. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        countryCode: "+1",
        mobile: "",
        message: "",
      });
      setSelectedDay(null);
      setSelectedTime(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Book a Consultation
          </DialogTitle>
          <p className="text-center text-muted-foreground text-sm">
            Select a date and time, then fill out the form to book your appointment
          </p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 p-4">
          {/* Calendar Section */}
          <div className="space-y-4">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={previousMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading availability...
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                  
                  {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                    <div key={`empty-${index}`} />
                  ))}
                  
                  {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    
                    const isPast = date < today;
                    const isToday = date.getTime() === today.getTime();
                    const inSelectableRange = isInSelectableRange(date);
                    const available = isAvailable(day);
                    const isSelected = selectedDay === day && currentDate.getMonth() === date.getMonth();
                    
                    // Determine the styling based on date status
                    let buttonClass = 'aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all';
                    let isClickable = false;
                    
                    if (isPast || isToday) {
                      // Past dates and today - greyed out
                      buttonClass += ' bg-muted text-muted-foreground cursor-not-allowed opacity-30';
                    } else if (inSelectableRange) {
                      // Within selectable range - show green/red based on availability
                      isClickable = available;
                      if (available) {
                        buttonClass += ' bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20 border-2 border-green-500/30 hover:scale-105';
                      } else {
                        buttonClass += ' bg-red-500/10 text-red-600 dark:text-red-400 border-2 border-red-500/30 cursor-not-allowed opacity-50';
                      }
                    } else {
                      // Outside selectable range but visible - neutral grey
                      buttonClass += ' bg-muted/50 text-muted-foreground/70 cursor-not-allowed opacity-40';
                    }
                    
                    if (isSelected) {
                      buttonClass += ' ring-2 ring-primary ring-offset-2';
                    }
                    
                    return (
                      <button
                        key={day}
                        onClick={() => isClickable && setSelectedDay(day)}
                        className={buttonClass}
                        disabled={!isClickable}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Time Slots */}
            {selectedDay && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  Available Times - {monthNames[currentDate.getMonth()]} {selectedDay}
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {getTimeSlots(selectedDay).map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-4 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500/20 border-2 border-green-500/30" />
                <span className="text-muted-foreground">Available Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500/20 border-2 border-red-500/30" />
                <span className="text-muted-foreground">No Slots</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-muted/50" />
                <span className="text-muted-foreground">Not Selectable</span>
              </div>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Bookings available for the next 7 days starting tomorrow
            </p>
          </div>

          {/* Contact Form Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <Label htmlFor="countryCode">Code *</Label>
                  <Input
                    id="countryCode"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    required
                    placeholder="+1"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="mobile">Mobile *</Label>
                  <Input
                    id="mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    required
                    placeholder="123-456-7890"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your project..."
                  rows={4}
                />
              </div>

              {selectedDay && selectedTime && (
                <div className="p-3 bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="w-4 h-4 text-primary" />
                    <span className="font-medium">
                      {monthNames[currentDate.getMonth()]} {selectedDay}, {currentDate.getFullYear()} at {selectedTime}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={!selectedDay || !selectedTime || submitting}
            >
              {submitting ? "Booking..." : "Book Appointment"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
