import * as React from "react";

// Simplified Calendar component to avoid dependency issues with react-day-picker/date-fns
// causing "Failed to load app" errors.
// This component is currently replaced by native date inputs in the app.

export type CalendarProps = React.HTMLAttributes<HTMLDivElement>;

function Calendar({ className, ...props }: CalendarProps) {
  return (
    <div className={className} {...props}>
      <p className="text-sm text-muted-foreground p-4">Calendar component temporarily disabled.</p>
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };