import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

type AccordionContextType = {
  value?: string;
  onValueChange?: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextType>({});

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean; defaultValue?: string }
>(({ className, children, ...props }, ref) => {
  const [value, setValue] = React.useState<string>(props.defaultValue || "");

  const handleValueChange = (newValue: string) => {
    setValue(prev => (prev === newValue ? "" : newValue));
  };

  return (
    <AccordionContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <div ref={ref} className={cn("", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});
Accordion.displayName = "Accordion";

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
  <div ref={ref} className={cn("border-b", className)} data-value={value} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(AccordionContext);
  // Find parent Item value
  // In a real app we might use context for Item too, but here we can infer or pass explicitly if needed.
  // For simplicity in this implementation, we assume the parent AccordionItem's value is passed down or we rely on the user structure.
  // However, since we can't easily reach up to DOM without ref, let's assume the user passes context or we wrap Item.
  
  // Alternative: The simple implementation requires AccordionItem to wrap children in a context or clone children.
  // Let's use a simpler context approach for Item.
  
  return (
    <AccordionItemContext.Consumer>
      {(itemValue) => {
        const isOpen = value === itemValue;
        return (
          <h3 className="flex">
            <button
              ref={ref}
              onClick={() => onValueChange?.(itemValue || "")}
              className={cn(
                "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                className
              )}
              data-state={isOpen ? "open" : "closed"}
              {...props}
            >
              {children}
              <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
          </h3>
        );
      }}
    </AccordionItemContext.Consumer>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { value } = React.useContext(AccordionContext);
  
  return (
    <AccordionItemContext.Consumer>
      {(itemValue) => {
        const isOpen = value === itemValue;
        if (!isOpen) return null;
        return (
          <div
            ref={ref}
            className={cn("overflow-hidden text-sm transition-all animate-fade-in", className)}
            {...props}
          >
            <div className={cn("pb-4 pt-0", className)}>{children}</div>
          </div>
        );
      }}
    </AccordionItemContext.Consumer>
  );
});
AccordionContent.displayName = "AccordionContent";

// Helper context for Item
const AccordionItemContext = React.createContext<string>("");

// Wrapper for Item to provide context
const AccordionItemWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ value, children, ...props }, ref) => (
  <AccordionItemContext.Provider value={value}>
    <AccordionItem ref={ref} value={value} {...props}>
      {children}
    </AccordionItem>
  </AccordionItemContext.Provider>
));
AccordionItemWrapper.displayName = "AccordionItem";

export { Accordion, AccordionItemWrapper as AccordionItem, AccordionTrigger, AccordionContent };
