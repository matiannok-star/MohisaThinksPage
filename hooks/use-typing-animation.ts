import { useState, useEffect } from 'react';

export function useTypingAnimation(text: string, duration: number = 20, isType: boolean = true) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!isType) {
        setDisplayedText(text);
        return;
    }
    
    let i = 0;
    setDisplayedText("");
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
          if (i >= text.length) {
              clearInterval(intervalId);
              return text;
          }
          const sliced = text.slice(0, i + 1);
          i++;
          return sliced;
      });
    }, duration);

    return () => clearInterval(intervalId);
  }, [text, duration, isType]);

  return { displayedText };
}